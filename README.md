# Memory Ticket

> **Every memory is a ticket to a moment that mattered.**

Memory Ticket is a **React Native mobile application** designed to turn meaningful moments into personalized digital memory tickets.

Instead of keeping important moments as ordinary photos in a gallery, Memory Ticket allows users to capture a memory, attach photos and details, and preserve the moment in a unique ticket-style format.

The application combines **memory journaling, photography, location information, device metadata, sharing, and PDF export** into one simple experience.

---

## Features

### Create Memory Tickets

Create a memory and turn it into a customized ticket containing your photos and important details.

### Capture Memories

Take a photo directly from the app or select images from your device gallery.

### Add Memory Details

Each memory can contain information such as:

* Title
* Description
* Date
* Photos
* Location
* Additional metadata

### Location Information

Memory Ticket can collect location information while creating a memory, allowing users to preserve where a moment happened.

### Device & Network Information

The application can collect useful device and network information and associate it with the memory.

### Favorites

Mark important memories as favorites and quickly access them later.

### Search

Search through saved memories to quickly find a specific moment.

### Edit Memories

Update memory information after it has been created.

### Full-Screen Image Viewer

Open memory images in a dedicated full-screen viewer.

### Share Memories

Share memory tickets with other people using the device's sharing capabilities.

### PDF Export

Generate a PDF version of a memory ticket for saving, printing, or sharing.

### Delete Confirmation

Memories require confirmation before deletion to help prevent accidental removal.

### Secure Local Data

Sensitive application data can be stored using secure device storage.

---

## The Concept

The idea behind Memory Ticket is to make memories feel more meaningful than a simple image in a gallery.

A normal photo stores the **image**.

Memory Ticket stores the **moment**.

```text
Photo
  +
Story
  +
Date
  +
Place
  +
Context
  ↓
Memory Ticket
```

Every ticket represents a specific moment that the user wants to remember.

---

## Architecture

Memory Ticket uses a modular React Native architecture with separate layers for the user interface, navigation, application state, storage, device capabilities, and API communication.

```text
                    ┌─────────────────────┐
                    │      User          │
                    └─────────┬───────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │   Screens & UI      │
                    │                     │
                    │ React Native        │
                    │ Components          │
                    └─────────┬───────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │     Navigation      │
                    │                     │
                    │ Stack / Tabs / Auth │
                    └─────────┬───────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │  State & Context    │
                    │                     │
                    │ Hooks / Context API │
                    └─────────┬───────────┘
                              │
             ┌────────────────┼────────────────┐
             │                │                │
             ▼                ▼                ▼
      ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
      │   Storage   │  │ Device APIs │  │  API Layer  │
      │             │  │             │  │             │
      │ AsyncStorage│  │ Camera      │  │ Axios       │
      │ SecureStore │  │ Location    │  │ REST API    │
      │             │  │ Device      │  │             │
      └─────────────┘  │ Network     │  └──────┬──────┘
                       │ Media       │         │
                       └─────────────┘         ▼
                                      ┌─────────────────┐
                                      │     Backend     │
                                      │                 │
                                      │ Authentication  │
                                      │ User Data       │
                                      │ Memory Data     │
                                      └────────┬────────┘
                                               │
                                               ▼
                                      ┌─────────────────┐
                                      │    Database     │
                                      └─────────────────┘
```

### Application Flow

A typical memory creation flow looks like this:

```text
User
 ↓
Create Memory
 ↓
Capture / Select Photos
 ↓
Enter Memory Details
 ↓
Collect Device / Location Data
 ↓
Create Memory Ticket
 ↓
Save Memory
 ↓
View / Edit / Favorite / Share / Export
```

---

## Tech Stack

### Mobile Application

* **React Native**
* **JavaScript**
* **Expo**
* **React Navigation**

### State & Storage

* **React Context API**
* **AsyncStorage**
* **Expo Secure Store**

### Device & Media

* **Expo Camera**
* **Expo Image Picker**
* **Expo Image Manipulator**
* **Expo Media Library**
* **Expo Location**
* **Expo Device**
* **Expo Network**

### Export & Sharing

* **Expo Print**
* **Expo Sharing**
* **React Native View Shot**
* **Expo File System**

### Networking & Validation

* **Axios**

### UI & Interaction

* **React Native Reanimated**
* **React Native Gesture Handler**
* **@gorhom/bottom-sheet**
* **Expo Vector Icons**

The versions currently defined in the repository include Expo 54, React Native 0.81.5, React 19.1, and React Navigation 7.x.

---

## Main Screens

The application is organized around a simple memory-focused experience, including screens for:

* Home
* Memories
* Create Memory
* Memory Details
* Edit Memory
* Ticket Preview
* Search
* Profile
* Settings
* About

The source code is organized under the project's `src` directory, with application assets kept separately under `assets`.

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js
* npm
* Expo CLI / Expo tooling
* VSCode

---

### 1. Clone the Repository

```bash
git clone https://github.com/Salman3410/Memory-Ticket.git
```

### 2. Open the Project

```bash
cd Memory-Ticket
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm start
```

This starts the Expo development server.

---

## Run on Android

To build and run the native Android application:

```bash
npm run android
```

You can also use the Expo development workflow to connect a physical Android device or emulator.

---

## Security & Privacy

Memory Ticket uses device storage and device capabilities to provide its core functionality.

Depending on the feature being used, the application may access:

* Photos and camera
* Location
* Secure device storage

Sensitive information should never be hard-coded into the application or committed to the repository.

When configuring development or production environments, keep API URLs, authentication secrets, and other private configuration values outside the source code.

---

## Future Improvements

Some areas that can be expanded in future versions include:

* Improved cloud synchronization
* More memory-ticket designs
* Categories and tags
* Memory reminders
* Timeline-based memory browsing
* Shared memories
* Improved cross-device synchronization
* More advanced location-based memory features

---

## 🤝 Contributing

Contributions, suggestions, bug reports, and feature ideas are welcome.

To contribute:

```bash
git clone https://github.com/Salman3410/Memory-Ticket.git
cd Memory-Ticket
npm install
```

Create a new branch, make your changes, test them, and open a pull request.

---

## License

This project currently does not specify an open-source license.

Unless a license is added to the repository, the source code should be considered **all rights reserved**.

---

## Developer

Developed by **Salman**

GitHub:
https://github.com/Salman3410

Repository:
https://github.com/Salman3410/Memory-Ticket

---

## Why Memory Ticket?

Photos are easy to collect.

Memories are harder to keep.

**Memory Ticket gives every important moment its own ticket.**

> **Capture it.
> Ticket it.
> Remember it.** 🎟️
