# Nexvy Platform Security Specification

## Data Invariants
1. A user's coin balance can only be updated via the server or strictly controlled client actions (e.g., small wins in spinner if allowed, but preferred via server).
2. Tasks can only be created/deleted by admins.
3. Submissions are immutable once approved/rejected except by admins.
4. Withdrawal requests are immutable after creation except for status updates by admins.
5. A user's profile can only be read by themselves or admins.
6. Leaderboards are publicly readable (limited fields).

## The "Dirty Dozen" Payloads
1. User A tries to update User B's coin balance.
2. User A tries to set themselves as an "admin".
3. User A tries to create a task.
4. User A tries to approve their own task submission.
5. User A tries to withdraw more than their current balance (checked on server, but rules should block if possible).
6. User A tries to delete someone else's withdrawal request.
7. User A tries to read all user profiles (list query without filter).
8. User A tries to update their `createdAt` timestamp.
9. User A tries to inject a 1MB string into a username field.
10. User A tries to claim the same referral code multiple times.
11. User A tries to bypass the daily reward cooldown.
12. User A tries to submit a task that doesn't exist.

## Collections & Roles
- `users`: {userId} matches auth.uid.
- `tasks`: Read-only for users, write for admins.
- `submissions`: Create for users, update for admins.
- `withdrawals`: Create for users, update for admins.
- `leaderboard`: Summarized view (or just a query on users).
- `admins`: List of uid's with admin privileges.
