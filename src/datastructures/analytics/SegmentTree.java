package datastructures.analytics;

public class SegmentTree {
    private int[] sumTree;
    private int[] minTree;
    private int[] maxTree;
    private int n;

    public SegmentTree(int[] arr) {
        this.n = arr.length;
        if (n > 0) {
            sumTree = new int[4 * n];
            minTree = new int[4 * n];
            maxTree = new int[4 * n];
            build(arr, 0, 0, n - 1);
        }
    }

    private void build(int[] arr, int node, int start, int end) {
        if (start == end) {
            sumTree[node] = arr[start];
            minTree[node] = arr[start];
            maxTree[node] = arr[start];
        } else {
            int mid = (start + end) / 2;
            int leftChild = 2 * node + 1;
            int rightChild = 2 * node + 2;
            build(arr, leftChild, start, mid);
            build(arr, rightChild, mid + 1, end);
            sumTree[node] = sumTree[leftChild] + sumTree[rightChild];
            minTree[node] = Math.min(minTree[leftChild], minTree[rightChild]);
            maxTree[node] = Math.max(maxTree[leftChild], maxTree[rightChild]);
        }
    }

    public void update(int idx, int val) {
        if (n > 0) update(0, 0, n - 1, idx, val);
    }

    private void update(int node, int start, int end, int idx, int val) {
        if (start == end) {
            sumTree[node] = val;
            minTree[node] = val;
            maxTree[node] = val;
        } else {
            int mid = (start + end) / 2;
            int leftChild = 2 * node + 1;
            int rightChild = 2 * node + 2;
            if (start <= idx && idx <= mid) {
                update(leftChild, start, mid, idx, val);
            } else {
                update(rightChild, mid + 1, end, idx, val);
            }
            sumTree[node] = sumTree[leftChild] + sumTree[rightChild];
            minTree[node] = Math.min(minTree[leftChild], minTree[rightChild]);
            maxTree[node] = Math.max(maxTree[leftChild], maxTree[rightChild]);
        }
    }

    public int rangeSum(int l, int r) {
        if (n == 0) return 0;
        return querySum(0, 0, n - 1, l, r);
    }

    private int querySum(int node, int start, int end, int l, int r) {
        if (r < start || end < l) return 0;
        if (l <= start && end <= r) return sumTree[node];
        int mid = (start + end) / 2;
        return querySum(2 * node + 1, start, mid, l, r) + querySum(2 * node + 2, mid + 1, end, l, r);
    }

    public int rangeMin(int l, int r) {
        if (n == 0) return Integer.MAX_VALUE;
        return queryMin(0, 0, n - 1, l, r);
    }

    private int queryMin(int node, int start, int end, int l, int r) {
        if (r < start || end < l) return Integer.MAX_VALUE;
        if (l <= start && end <= r) return minTree[node];
        int mid = (start + end) / 2;
        return Math.min(queryMin(2 * node + 1, start, mid, l, r), queryMin(2 * node + 2, mid + 1, end, l, r));
    }

    public int rangeMax(int l, int r) {
        if (n == 0) return Integer.MIN_VALUE;
        return queryMax(0, 0, n - 1, l, r);
    }

    private int queryMax(int node, int start, int end, int l, int r) {
        if (r < start || end < l) return Integer.MIN_VALUE;
        if (l <= start && end <= r) return maxTree[node];
        int mid = (start + end) / 2;
        return Math.max(queryMax(2 * node + 1, start, mid, l, r), queryMax(2 * node + 2, mid + 1, end, l, r));
    }
}
