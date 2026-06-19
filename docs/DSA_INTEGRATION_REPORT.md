# DSA Integration Report

## 1. Segment Tree
**Purpose:** Answers complex range queries (Min, Max, Sum) over array intervals in `O(log N)` time.
**Usage:** Replaced `O(N)` Stream linear iterations for calculating Warehouse Stock bounds.

**Execution Path:**
1. **Frontend**: User loads `/analytics`. `AnalyticsDashboard.jsx` fetches `api.get('/stats/inventory')`.
2. **API Layer**: `AnalyticsHandler.java` catches `/api/stats/inventory`.
3. **Service Layer**: Invokes `execDashboard.getInventoryMax(0, lastIdx)`.
4. **DSA Layer**: `inventorySegment.rangeMax()` computes the absolute maximum stock among all connected warehouses in `O(log N)`.
5. **Frontend UI**: Renders result directly in the "Algorithms Powering This Dashboard" card:
   `→ Result: 12,500 units max single block`

## 2. Fenwick Tree (Binary Indexed Tree)
**Purpose:** Dynamically tracks cumulative sums across arrays by storing partial sums in `O(log N)` time.
**Usage:** Powers the Revenue Trend Chart by calculating running daily revenue without an `O(N)` accumulator loop.

**Execution Path:**
1. **Frontend**: User loads `/analytics`. `AnalyticsDashboard.jsx` fetches `api.get('/stats/revenue')`.
2. **API Layer**: `AnalyticsHandler.java` iterates over the chronological list of days.
3. **Service Layer**: Instead of adding `cumulative += daily`, it queries `execDashboard.getCumulativeRevenue(dayIndex)`.
4. **DSA Layer**: `revenueFenwick.prefixSum(dayIndex)` executes bitwise index traversing to return the exact sum instantly.
5. **Frontend UI**: Data populates the Recharts trend lines, and the exact live calculation is displayed on the UI:
   `revenueFenwick.prefixSum(todayIndex); → Result: $1,250,000`
