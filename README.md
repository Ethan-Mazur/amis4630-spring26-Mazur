# amis4630-spring26-Mazur
AMIS 4630 Buckeye Marketplace Project
Table of Contents
# Summary
Buckeye Marketplace is a student-focused e-commerce platform designed to connect Ohio State students with peer-to-peer buying and selling opportunities. The platform aims to simplify the student experience by:
* Enabling students to quickly list and discover products and services.
* Providing secure and intuitive payment and messaging systems.
* Supporting university clubs, student organizations, and partner company listings to boost engagement on campus.
# Feature Prioritization 
Feature Prioritization is done through labels. Low, Medium, and High labels are attached to features matching the respective priority. Any feature labeled [launch requirement] has the highest priority.
# Architecture Decisions
Overall Architecture Style
3-Tier Web Application Architecture (Frontend, Backend, Database)

Reasons:
* Separates concerns for UI, Business Logic, and Data
* Makes future scaling easier
* Industry standard for marketplace platforms (according to ChatGPT)
* Supports modular frontend foundation requirement

Frontend Technology
Use React

Reasons:
* Component-based architecture (ideal for listings, cards, forms)
* Fast UI updates for dynamic marketplace browsing
* Large ecosystem and strong documentation
* Aligns well with REST APIs

Backend Technology
Use Node.js with Express.js

Reasons:
* Lightweight and fast for REST APIs
* Same language as frontend (JavaScript)
* Easy integration with authentication and database layers

Database Technology
Use PostgreSQL

Reasons:
* Relational model fits ERD design (User, Listing, Order/Transaction, Review)
* Supports one-to-many and many-to-many relationships
* Strong data integrity
* Widely used in production systems

Authentication Strategy
OAuth (Google/OSU login)

Reasons:
* No new passwords
* Fast signup
* Trust & verification
OAuth:
* Reduces fake accounts
* Improves recruiter trust
* Speeds onboarding

Hosting
AWS

Reasons:
* Industry standard
* Scalable
* Supports EC2 (backend), RDS (database), S3 (images)
# AI Usage
USED PROMPTS for 2.System Architecture Diagram
* Could I use Draw.io to create a System Architecture Diagram?
* I need to create a System Architecture Diagram for Buckeye Marketplace. I'm working on Milestone 2. This milestone is focused on Architecture Design and Frontend Foundation.
* I'm also supposed to "Connect architecture decisions back to user needs from Milestone 1"

USED PROMPTS for 3.Database Schema Design
* I need to create a Database Schema Design using an Entity Relationship Diagram. I only need to create the main tables and relationships needed to support my prioritized features. The relationship mappings are one-to-many & many-to-many Do Not Include: Column-level details (data types, constraints) or worry about things like normalization at this stage. I need to Focus on the big picture of how data entities relate to each other and support my user stories. 
* I also need to explain how schema supports my user stories

USED PROMPTS for 4.Architecture Decision Records
* Architecture Decision Records 
* What technology should I use and why?

USED PROMPTS for 5.Component Architecture
* Component Architecture
* I need to use Atomic Design principles to create a component hierarchy. I need to scope the components to the Product Catalog feature for now to keep it simple

USED Prompt to generate sample summary of business system
* I need to make a summary of my business system