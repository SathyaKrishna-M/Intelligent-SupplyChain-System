package datastructures.analytics;

public class FenwickTree {
    private double[] tree;
    private int n;

    public FenwickTree(int n) {
        this.n = n;
        tree = new double[n + 1];
    }

    public void update(int i, double val) {
        i++; // Convert to 1-based index
        while (i <= n) {
            tree[i] += val;
            i += i & (-i);
        }
    }

    public double prefixSum(int i) {
        i++;
        if (i > n) i = n; // Safe bounds mapping for dynamic runtime data
        double sum = 0;
        while (i > 0) {
            sum += tree[i];
            i -= i & (-i);
        }
        return sum;
    }

    public double rangeSum(int l, int r) {
        return prefixSum(r) - prefixSum(l - 1);
    }
}
