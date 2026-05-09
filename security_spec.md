# security_spec.md

## Data Invariants
1. Users can only read and write their own profile data.
2. Only Admins can access the `admins` collection.
3. Access to `submissions` and `withdrawals` is limited to the user who created them (read) and Admins (read/write).
4. `tasks` and `quiz` are read-only for users, but read/write for Admins.
5. All IDs must be valid alphanumeric strings.
6. Timestamps must be verified against server time.

## Dirty Dozen Payloads (Rejection Expected)
1. **Identity Spoofing**: User A trying to update User B's coins.
2. **Admin Escalation**: User A trying to create an entry in the `admins` collection.
3. **Ghost Field Update**: Updating a Task with an unauthorized `isVerified` field.
4. **Invalid Type**: Sending a string for a `rewardCoins` number field.
5. **PII Leak**: Non-admin user trying to list all user emails.
6. **Self-Approval**: User A trying to approve their own Task Submission.
7. **Bypass Maintenance**: User trying to write to `settings` document.
8. **Negative Amount**: User requesting a withdrawal of -$100.
9. **Jumbo ID**: Using a 2KB string as a document ID.
10. **Client Timestamp**: Providing a hardcoded `createdAt` instead of server timestamp.
11. **Double Coin Reward**: User trying to update their own coins directly without a submission approval.
12. **Status Shortcut**: Moving a withdrawal directly from `pending` to `successful` without an admin.
