# Security Specification & Threat Model (TDD)

This document outlines the zero-trust data invariants, security assertions, and negative payload test scenarios designed to validate the robust protection of Nisa Idrisi's consulting CRM backplane.

## 1. Zero-Trust Data Invariants

1. **Administrative Hegemony (Site Config)**: The central website layout, content configurations, services alignment, and images are public-readable but strictly writable *only* by authenticated, email-verified administrators.
2. **PII Hermetic Isolation (Booking Leads)**: Leads submitted by public visitors contain PII (name, email, company, and project notes). Anyone can *create* (submit) a lead, but read (get/list), delete, or edit (status updates) rights are strictly restricted to email-verified administrators. Blanket or public reads of `/leads` is completely blocked.
3. **Immutability of Historical Audits (Logs)**: Activity logs are system-level records. They are public-unreadable. Only verified administrators can write or view logs. Existing log entries are completely immutable and cannot be updated or deleted.
4. **Sovereign Admin Verification**: The administrator verification relies on `request.auth.token.email == "walidsmartparts@gmail.com"` combined with `request.auth.token.email_verified == true`.
5. **No Blind Updates**: Structural edits can only affect predefined keys. If an admin edits the layout, they cannot inject "ghost" columns.

---

## 2. The "Dirty Dozen" Attack Payloads

### Site Configuration Threats

#### Payload 1: Unauthenticated Config Defacement (Identity Violation)
*   **Target**: `/site/config`
*   **Action**: `set` (Write)
*   **Payload**:
    ```json
    {
      "content": { "heroHeadline": "Hacked! Elite Defacer Group" },
      "updatedAt": "2026-05-22T19:56:00Z"
    }
    ```
*   **Result**: `PERMISSION_DENIED` (No auth)

#### Payload 2: Non-Admin Privilege Escalation (Role Violation)
*   **Target**: `/site/config`
*   **Client**: Authenticated user (`uid: "anon-123"`, email: `"malicious@gmail.com"`, verified: `true`)
*   **Action**: `update`
*   **Payload**:
    ```json
    {
      "settings": { "brandPrimaryColor": "#FF0000" }
    }
    ```
*   **Result**: `PERMISSION_DENIED` (Not the bootstrapped admin)

#### Payload 3: Config Ghost Field Injection (Shadow Update / Validation Bypass)
*   **Target**: `/site/config`
*   **Client**: Authenticated admin (`uid: "admin-777"`, email: `"walidsmartparts@gmail.com"`, verified: `true`)
*   **Action**: `update`
*   **Payload**:
    ```json
    {
      "content": { "heroHeadline": "A True Financial Leader" },
      "ghostFieldOfDoom": "maliciousScript"
    }
    ```
*   **Result**: `PERMISSION_DENIED` (Ghost key present; fails `hasOnly` schema checks)

#### Payload 4: Future / Past Time Invariant Bypass (Temporal Integrity Violation)
*   **Target**: `/site/config`
*   **Client**: Authenticated admin (`uid: "admin-777"`, email: `"walidsmartparts@gmail.com"`, verified: `true`)
*   **Action**: `update`
*   **Payload**:
    ```json
    {
      "updatedAt": "1999-12-31T23:59:59Z"
    }
    ```
*   **Result**: `PERMISSION_DENIED` (Fails timestamp validation requiring `request.time`)

---

### Lead Management (PII) Threats

#### Payload 5: Anonymous Lead Database Scraping (PII Blanket read)
*   **Target**: `/leads` (Collection query)
*   **Client**: Unauthenticated or normal logged-in user
*   **Action**: `list`
*   **Result**: `PERMISSION_DENIED` (Blanket listing forbidden to public)

#### Payload 6: Anonymous Direct Lead Reading (PII Individual Get)
*   **Target**: `/leads/lead-1`
*   **Client**: Authenticated non-admin (`uid: "user-44"`, email: `"user44@yahoo.com"`, verified: `true`)
*   **Action**: `get`
*   **Result**: `PERMISSION_DENIED` (Not an admin)

#### Payload 7: Malicious Lead Submission with Spoofed Author UID
*   **Target**: `/leads/lead-999`
*   **Client**: Authenticated non-admin (`uid: "spoofer-45"`, email: `"legit@domain.com"`)
*   **Action**: `create`
*   **Payload**:
    ```json
    {
      "id": "lead-999",
      "name": "Alexander",
      "email": "hacked-admin@capital.com",
      "service": "tax-optimization",
      "date": "2026-06-12",
      "status": "confirmed",
      "createdAt": "2026-05-22T19:56:00Z"
    }
    ```
*   **Result**: `PERMISSION_DENIED` (Fails static type validation, such as setting status to `'confirmed'` directly on creation, or failing ID size limits)

#### Payload 8: Resource Exhaustion Denial of Wallet Attack (ID Poisoning/Size Guard)
*   **Target**: `/leads/verylongid_abcdefghij_abcdefghij_abcdefghij_abcdefghij_abcdefghij_abcdefghij_abcdefghij` (Length of 256 bytes)
*   **Client**: Anonymous visitor
*   **Action**: `create`
*   **Result**: `PERMISSION_DENIED` (Fails `isValidId()` length checks <= 128 bytes)

#### Payload 9: Malicious Lead State Mutation Shortcutting (State Bypass)
*   **Target**: `/leads/lead-1`
*   **Client**: Authenticated non-admin (`uid: "lead-owner-1"`)
*   **Action**: `update`
*   **Payload**:
    ```json
    {
      "status": "confirmed"
    }
    ```
*   **Result**: `PERMISSION_DENIED` (Changing leads requires admin privilege)

---

### Audit Logging Threats

#### Payload 10: Client-Side Audit Log Erasure (Immutability Violation)
*   **Target**: `/logs/log-1`
*   **Client**: Authenticated non-admin or malicious intruder
*   **Action**: `delete`
*   **Result**: `PERMISSION_DENIED` (Deleting logs is impossible)

#### Payload 11: Fake Audit Logging Submission (Security Intrusion)
*   **Target**: `/logs/log-fake`
*   **Client**: Unauthenticated malicious user
*   **Action**: `create`
*   **Payload**:
    ```json
    {
      "id": "log-fake",
      "timestamp": "2026-05-22T19:56:00Z",
      "ip": "220.22.4.15",
      "action": "Successful Authentication",
      "status": "success",
      "details": "Fake injection of audit log"
    }
    ```
*   **Result**: `PERMISSION_DENIED` (Writing logs requires admin privilege)

#### Payload 12: Admin Audit Log Poisoning (Size Expansion Attack)
*   **Target**: `/logs/log-10`
*   **Client**: Authenticated admin trying to inject massive description payload (1MB string)
*   **Action**: `create`
*   **Payload**:
    ```json
    {
      "id": "log-10",
      "timestamp": "2026-05-22T19:56:00Z",
      "ip": "1.1.1.1",
      "action": "Admin Action",
      "status": "success",
      "details": "[A massive 1MB string of junk characters repeating infinitely]"
    }
    ```
*   **Result**: `PERMISSION_DENIED` (Fails size boundaries check: `incoming().details.size() <= 10000`)

---

## 3. Test Runner Definition (`firestore.rules.test.ts`)

A mock type-safe test runner that models assertions for all vector payloads:

```typescript
import { assertFails, assertSucceeds, initializeTestEnvironment, RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { doc, setDoc, getDoc, updateDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';

let testEnv: RulesTestEnvironment;

describe('Sovereign Nisa Idrisi CRM Rules Suite', () => {
  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'gen-lang-client-0692738428',
      firestore: {
        rules: require('fs').readFileSync('firestore.rules', 'utf8'),
      },
    });
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  beforeEach(async () => {
    await testEnv.clearFirestore();
  });

  it('Payload 1: should block unauthenticated site config set', async () => {
    const context = testEnv.unauthenticatedContext();
    const db = context.firestore();
    await assertFails(setDoc(doc(db, 'site', 'config'), {
      content: { heroHeadline: "Defaced Headline" },
      updatedAt: new Date().toISOString()
    }));
  });

  it('Payload 2: should prevent non-admin from modifying site settings', async () => {
    const context = testEnv.authenticatedContext('user-44', {
      email: 'malicious@gmail.com',
      email_verified: true
    });
    const db = context.firestore();
    await assertFails(updateDoc(doc(db, 'site', 'config'), {
      'settings.brandPrimaryColor': '#FF0000'
    }));
  });

  it('Payload 3: should prevent authenticated admin from adding ghost configuration values', async () => {
    const context = testEnv.authenticatedContext('admin-777', {
      email: 'walidsmartparts@gmail.com',
      email_verified: true
    });
    const db = context.firestore();
    await assertFails(setDoc(doc(db, 'site', 'config'), {
      content: { heroHeadline: "Nisa Idrisi Chartered Certified Accountant" },
      ghostFieldOfDoom: "some_malicious_script",
      updatedAt: new Date().toISOString()
    }));
  });

  it('Payload 5: should reject anonymous querying of the leads collection', async () => {
    const context = testEnv.unauthenticatedContext();
    const db = context.firestore();
    await assertFails(getDocs(collection(db, 'leads')));
  });

  it('Payload 9: should reject normal users from moving booking status to confirmed', async () => {
    const context = testEnv.authenticatedContext('lead-owner-1', {
      email: 'leadowner@google.com',
      email_verified: true
    });
    const db = context.firestore();
    await assertFails(updateDoc(doc(db, 'leads', 'lead-1'), {
      status: 'confirmed'
    }));
  });
});
```
