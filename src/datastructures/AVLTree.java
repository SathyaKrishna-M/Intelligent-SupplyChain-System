package datastructures;

import models.Product;

public class AVLTree {
    private class Node {
        Product product;
        int height;
        Node left, right;

        Node(Product product) {
            this.product = product;
            this.height = 1;
        }
    }

    private Node root;

    private int height(Node N) {
        if (N == null) return 0;
        return N.height;
    }

    private int max(int a, int b) {
        return (a > b) ? a : b;
    }

    private Node rightRotate(Node y) {
        Node x = y.left;
        Node T2 = x.right;

        x.right = y;
        y.left = T2;

        y.height = max(height(y.left), height(y.right)) + 1;
        x.height = max(height(x.left), height(x.right)) + 1;

        return x;
    }

    private Node leftRotate(Node x) {
        Node y = x.right;
        Node T2 = y.left;

        y.left = x;
        x.right = T2;

        x.height = max(height(x.left), height(x.right)) + 1;
        y.height = max(height(y.left), height(y.right)) + 1;

        return y;
    }

    private int getBalance(Node N) {
        if (N == null) return 0;
        return height(N.left) - height(N.right);
    }

    public void insert(Product product) {
        root = insertRec(root, product);
    }

    private Node insertRec(Node node, Product product) {
        if (node == null) return new Node(product);

        int cmp = product.getName().compareToIgnoreCase(node.product.getName());
        if (cmp < 0) node.left = insertRec(node.left, product);
        else if (cmp > 0) node.right = insertRec(node.right, product);
        else return node;

        node.height = 1 + max(height(node.left), height(node.right));
        int balance = getBalance(node);

        if (balance > 1 && product.getName().compareToIgnoreCase(node.left.product.getName()) < 0)
            return rightRotate(node);

        if (balance < -1 && product.getName().compareToIgnoreCase(node.right.product.getName()) > 0)
            return leftRotate(node);

        if (balance > 1 && product.getName().compareToIgnoreCase(node.left.product.getName()) > 0) {
            node.left = leftRotate(node.left);
            return rightRotate(node);
        }

        if (balance < -1 && product.getName().compareToIgnoreCase(node.right.product.getName()) < 0) {
            node.right = rightRotate(node.right);
            return leftRotate(node);
        }

        return node;
    }

    public Product search(String name) {
        return searchRec(root, name);
    }

    private Product searchRec(Node root, String name) {
        if (root == null) return null;
        int cmp = name.compareToIgnoreCase(root.product.getName());
        if (cmp == 0) return root.product;
        if (cmp < 0) return searchRec(root.left, name);
        return searchRec(root.right, name);
    }

    public void delete(String name) {
        root = deleteRec(root, name);
    }

    private Node minValueNode(Node node) {
        Node current = node;
        while (current.left != null) current = current.left;
        return current;
    }

    private Node deleteRec(Node root, String name) {
        if (root == null) return root;

        int cmp = name.compareToIgnoreCase(root.product.getName());
        if (cmp < 0) root.left = deleteRec(root.left, name);
        else if (cmp > 0) root.right = deleteRec(root.right, name);
        else {
            if ((root.left == null) || (root.right == null)) {
                Node temp = null;
                if (temp == root.left) temp = root.right;
                else temp = root.left;

                if (temp == null) {
                    temp = root;
                    root = null;
                } else {
                    root = temp;
                }
            } else {
                Node temp = minValueNode(root.right);
                root.product = temp.product;
                root.right = deleteRec(root.right, temp.product.getName());
            }
        }

        if (root == null) return root;

        root.height = max(height(root.left), height(root.right)) + 1;
        int balance = getBalance(root);

        if (balance > 1 && getBalance(root.left) >= 0)
            return rightRotate(root);

        if (balance > 1 && getBalance(root.left) < 0) {
            root.left = leftRotate(root.left);
            return rightRotate(root);
        }

        if (balance < -1 && getBalance(root.right) <= 0)
            return leftRotate(root);

        if (balance < -1 && getBalance(root.right) > 0) {
            root.right = rightRotate(root.right);
            return leftRotate(root);
        }

        return root;
    }
}
