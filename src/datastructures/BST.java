package datastructures;

import models.Product;
import java.util.ArrayList;
import java.util.List;

public class BST {
    private class Node {
        Product product;
        Node left;
        Node right;

        Node(Product product) {
            this.product = product;
        }
    }

    private Node root;

    public void insert(Product product) {
        root = insertRec(root, product);
    }

    private Node insertRec(Node root, Product product) {
        if (root == null) {
            return new Node(product);
        }
        int cmp = product.getProductId().compareToIgnoreCase(root.product.getProductId());
        if (cmp < 0) {
            root.left = insertRec(root.left, product);
        } else if (cmp > 0) {
            root.right = insertRec(root.right, product);
        }
        return root;
    }

    public Product search(String productId) {
        return searchRec(root, productId);
    }

    private Product searchRec(Node root, String productId) {
        if (root == null) return null;
        int cmp = productId.compareToIgnoreCase(root.product.getProductId());
        if (cmp == 0) return root.product;
        if (cmp < 0) return searchRec(root.left, productId);
        return searchRec(root.right, productId);
    }

    public void delete(String productId) {
        root = deleteRec(root, productId);
    }

    private Node deleteRec(Node root, String productId) {
        if (root == null) return null;
        int cmp = productId.compareToIgnoreCase(root.product.getProductId());
        if (cmp < 0) {
            root.left = deleteRec(root.left, productId);
        } else if (cmp > 0) {
            root.right = deleteRec(root.right, productId);
        } else {
            if (root.left == null) return root.right;
            else if (root.right == null) return root.left;

            root.product = minValue(root.right);
            root.right = deleteRec(root.right, root.product.getProductId());
        }
        return root;
    }

    private Product minValue(Node root) {
        Product minv = root.product;
        while (root.left != null) {
            minv = root.left.product;
            root = root.left;
        }
        return minv;
    }

    public List<Product> inorderTraversal() {
        List<Product> list = new ArrayList<>();
        inorderRec(root, list);
        return list;
    }

    private void inorderRec(Node root, List<Product> list) {
        if (root != null) {
            inorderRec(root.left, list);
            list.add(root.product);
            inorderRec(root.right, list);
        }
    }
}
