# VOUCHIQO COMPLETE BUSINESS FLOW ARCHITECTURE

## PRODUCT POSITIONING

Vouchiqo is a verified deals and merchant growth platform.

Primary Goal:

Help customers discover trusted offers.

Help merchants turn offers into customers.

Tagline:

Verified Deals. Real Savings.

Platform Principles:

1. Trust First
2. Savings Second
3. Technology Third

---

# MAIN USER TYPES

1. Customer

Finds deals.
Claims coupons.
Uses coupons.
Tracks savings.

2. Merchant

Creates deals.
Manages coupons.
Tracks performance.
Acquires customers.

3. Admin

Moderates platform.
Approves merchants.
Controls featured placements.
Manages analytics.

---

# CUSTOMER FLOW

Visitor

↓

Homepage

↓

Search Deals

↓

View Coupon

↓

Claim Coupon

↓

Visit Merchant

↓

Redeem Coupon

↓

Savings Tracked

↓

Become Returning Customer

---

# MERCHANT FLOW

Merchant Signup

↓

Business Verification

↓

Merchant Approval

↓

Create Business Profile

↓

Upload Logo

↓

Upload Banner

↓

Create Coupon

↓

Publish Coupon

↓

Customers Claim

↓

Customers Redeem

↓

Merchant Analytics Update

↓

Merchant Purchases Promotion

↓

Featured Placement

---

# HOMEPAGE FLOW

Homepage

Contains:

1. Navbar

2. Location Selector

3. Hot Deals Ticker

4. Hero Section

5. Search

6. Category Strip

7. Featured Deals

8. Nearby Deals

9. Personalized Deals

10. Expired Coupon Revival Section

11. Trending Brands

12. Merchant CTA

13. FAQ

14. Footer

---

# HOT DEALS TICKER FLOW

Homepage Load

↓

Ticker Service

↓

Get Featured Deals

↓

Sort By Priority

Priority:

1. Paid Featured Merchants

2. Enterprise Merchants

3. Pro Merchants

4. Growth Merchants

5. Starter Merchants

↓

Display In Ticker

↓

Track Impressions

↓

Track Clicks

---

# LOCATION FLOW

User Visits Homepage

↓

Location Check

↓

Location Exists?

YES

↓

Load Local Deals

NO

↓

Show Location Prompt

↓

Select City

↓

Save Location

↓

Refresh Deals

↓

Show:

Near Me

All India

---

# INTEREST FLOW

User Signup

↓

Select Interests

↓

Store Preferences

↓

Homepage Personalization

↓

Sort Deals Based On Interests

↓

Newsletter Filtering

↓

Notification Filtering

---

# COUPON FLOW

Merchant Creates Coupon

↓

Coupon Validation

↓

Coupon Published

↓

Visible On Platform

↓

Customer Views Coupon

↓

Customer Claims Coupon

↓

Claim Record Created

↓

Customer Redeems Coupon

↓

Redemption Record Created

↓

Savings Calculated

↓

Analytics Updated

---

# CLAIM FLOW

Customer

↓

Claim Coupon

↓

Create Claim Record

Store:

User
Coupon
Merchant
Timestamp

↓

Increase Claim Count

↓

Update Analytics

---

# REDEMPTION FLOW

Customer

↓

Redeem Coupon

↓

Merchant Validates Coupon

↓

Coupon Active?

↓

YES

↓

Redemption Created

Store:

User
Merchant
Coupon
Original Amount
Discount Amount
Final Amount
Timestamp

↓

Savings Updated

↓

Merchant Analytics Updated

↓

Customer Analytics Updated

↓

Platform Analytics Updated

---

# FRAUD PROTECTION FLOW

Redemption Request

↓

Check Coupon Status

↓

Check Expiry

↓

Check Usage Limit

↓

Check User Limit

↓

Check Duplicate Redemption

↓

Redis Lock

↓

Allow Redemption

↓

Audit Log

---

# SAVINGS DASHBOARD FLOW

Redemption Created

↓

Calculate Savings

↓

Customer Dashboard

Displays:

Total Saved

Lifetime Saved

Total Spend

Savings Rate

Top Categories

Top Brands

Savings Timeline

Transaction History

---

# EXPIRED COUPON REVIVAL FLOW

Customer Has Expired Coupon

↓

Submit Revival Request

↓

Store Request

↓

Admin Review

↓

Merchant Contact

↓

Approved / Rejected

↓

Customer Notified

↓

Status Updated

---

# MERCHANT ANALYTICS FLOW

Coupon Views

↓

Coupon Clicks

↓

Coupon Claims

↓

Coupon Redemptions

↓

Analytics Aggregation

↓

Dashboard KPIs

Show:

Views

Claims

Redemptions

Conversion Rate

Revenue Generated

Brand Page Views

Ticker Impressions

---

# ADMIN FLOW

Admin Login

↓

Dashboard

↓

Manage Users

↓

Manage Merchants

↓

Approve Merchants

↓

Manage Coupons

↓

Manage Featured Deals

↓

Manage Homepage Ticker

↓

Manage Revival Requests

↓

View Platform Analytics

---

# DATABASE OWNERSHIP

Users

Own:

Claims
Saved Coupons
Preferences
Savings

Merchants

Own:

Business Profile
Coupons
Analytics

Coupons

Own:

Claims
Redemptions
Views

---

# REDIS RESPONSIBILITIES

Only Store:

OTP

Rate Limits

Homepage Cache

Featured Deals Cache

Trending Deals Cache

Location Feed Cache

Redemption Locks

Session Cache

BullMQ Jobs

Never Store Business Data Permanently.

---

# CORE PLATFORM MODULES

Auth

Users

Merchants

Business Profiles

Coupons

Claims

Redemptions

Categories

Locations

Reviews

Brand Following

Savings

Analytics

Notifications

Revivals

Subscriptions

Featured Deals

Homepage Ticker

Admin

Audit Logs

---

# DEVELOPMENT ORDER

1. Authentication

2. RBAC

3. User Profiles

4. Merchant Profiles

5. Coupons

6. Search

7. Claims

8. Redemptions

9. Savings Dashboard

10. Merchant Analytics

11. Featured Deals

12. Homepage Ticker

13. Revival System

14. Notifications

15. Admin Panel

16. Redis Caching

17. BullMQ Jobs

18. Production Optimization

This document is the source of truth for the entire Vouchiqo platform.
