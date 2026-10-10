# Memento Android Widget

The v2.5 widget is intentionally lightweight: it shows the Memento identity, a latest-memory slot, and the total-memory count.

The widget task handler currently renders a safe fallback when the JS widget runtime does not have access to the app's authenticated memory store. The app can later push the latest count/title into the widget when memory data changes.

## Native build

The widget requires a development/release native build after running the Expo config plugin. It does not work as a real Android home-screen widget in Expo Go.
