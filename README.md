# Intelligent Supply Chain & Inventory Optimization System

An enterprise-grade, highly-performant Supply Chain Management platform built from scratch without external database dependencies. This system acts as a comprehensive **ERP / WMS** suite with real-time Logistics mapping, Analytics, and Demand Forecasting.

## Features
- **Multi-Role Dashboards**: Specific views for Admins, Warehouse Managers, Logistics Managers, and Suppliers.
- **Custom Data Structures**: Uses AVL Trees, B-Trees, Segment Trees, Fenwick Trees, and Graphs for memory-efficient and blazing fast O(log N) operations.
- **Advanced Algorithms**: Integrates Dijkstra's Algorithm for Shortest Path routing and Simple Moving Average (SMA) for inventory demand forecasting.
- **File-Based Persistence**: All data is efficiently parsed and serialized to raw text files mimicking custom DBMS paging.
- **React 18 Frontend**: A beautiful, modern, responsive Single Page Application utilizing Tailwind CSS and Context API.

## Project Structure
- `/src` - The Core Java 17 Backend Engine.
- `/frontend` - The React 18 Frontend application.
- `/data` - The flat-file persistence layer.
- `/logs` - Audit logs and application telemetry.

## Evaluation Ready
This project includes a seeded `DemoDataGenerator` that creates 500 Orders, 100 Products, and 200 Shipments instantly for presentation purposes. See the `System Health` tab in the application for live memory and API response metrics.
