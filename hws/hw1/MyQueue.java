class MyQueue {
    private Node first;
    private Node last;

    public void enqueue(String s) {
        Node newNode = new Node(s);
        if (last != null) {
            last.next = newNode;
        }
        last = newNode;
        if (first == null) first = newNode;
    }

    public String dequeue() {
        if (first == null) return "empty";
        String value = first.data;
        first = first.next;
        if (first == null) last = null;
        return value;
    }

    public boolean isEmpty() {
        return first == null;
    }
}