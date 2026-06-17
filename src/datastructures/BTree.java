package datastructures;

import models.Order;
import java.util.ArrayList;
import java.util.List;

public class BTree {
    private int T;

    private class Node {
        int n;
        Order[] keys;
        Node[] C;
        boolean leaf;

        public Node(boolean leaf) {
            this.leaf = leaf;
            this.keys = new Order[2 * T - 1];
            this.C = new Node[2 * T];
            this.n = 0;
        }

        public void insertNonFull(Order k) {
            int i = n - 1;
            if (leaf) {
                while (i >= 0 && keys[i].getOrderId().compareTo(k.getOrderId()) > 0) {
                    keys[i + 1] = keys[i];
                    i--;
                }
                keys[i + 1] = k;
                n = n + 1;
            } else {
                while (i >= 0 && keys[i].getOrderId().compareTo(k.getOrderId()) > 0) {
                    i--;
                }
                if (C[i + 1].n == 2 * T - 1) {
                    splitChild(i + 1, C[i + 1]);
                    if (keys[i + 1].getOrderId().compareTo(k.getOrderId()) < 0) {
                        i++;
                    }
                }
                C[i + 1].insertNonFull(k);
            }
        }

        public void splitChild(int i, Node y) {
            Node z = new Node(y.leaf);
            z.n = T - 1;
            for (int j = 0; j < T - 1; j++) {
                z.keys[j] = y.keys[j + T];
            }
            if (!y.leaf) {
                for (int j = 0; j < T; j++) {
                    z.C[j] = y.C[j + T];
                }
            }
            y.n = T - 1;
            for (int j = n; j >= i + 1; j--) {
                C[j + 1] = C[j];
            }
            C[i + 1] = z;
            for (int j = n - 1; j >= i; j--) {
                keys[j + 1] = keys[j];
            }
            keys[i] = y.keys[T - 1];
            n = n + 1;
        }

        public Order search(String orderId) {
            int i = 0;
            while (i < n && orderId.compareTo(keys[i].getOrderId()) > 0) {
                i++;
            }
            if (i < n && keys[i].getOrderId().equals(orderId)) {
                return keys[i];
            }
            if (leaf) {
                return null;
            }
            return C[i].search(orderId);
        }

        public void traverse(List<Order> list) {
            int i;
            for (i = 0; i < n; i++) {
                if (!leaf) {
                    C[i].traverse(list);
                }
                list.add(keys[i]);
            }
            if (!leaf) {
                C[i].traverse(list);
            }
        }
    }

    private Node root;

    public BTree(int t) {
        this.T = t;
        root = null;
    }

    public void insert(Order k) {
        if (root == null) {
            root = new Node(true);
            root.keys[0] = k;
            root.n = 1;
        } else {
            if (root.n == 2 * T - 1) {
                Node s = new Node(false);
                s.C[0] = root;
                s.splitChild(0, root);
                int i = 0;
                if (s.keys[0].getOrderId().compareTo(k.getOrderId()) < 0) {
                    i++;
                }
                s.C[i].insertNonFull(k);
                root = s;
            } else {
                root.insertNonFull(k);
            }
        }
    }

    public Order search(String orderId) {
        if (root == null) {
            return null;
        } else {
            return root.search(orderId);
        }
    }

    public List<Order> traverse() {
        List<Order> list = new ArrayList<>();
        if (root != null) {
            root.traverse(list);
        }
        return list;
    }
}
