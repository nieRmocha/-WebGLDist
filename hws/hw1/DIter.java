class DIter
{
    public DNode cur;
    public DList list;

    public DIter(DList list)
    {
        this.list = list;
        cur = list.first;
    }

    public boolean atEnd()
    {
        if (cur == null) {
            return true;
        }
        else
            return false;
    }

    public void prev()
    {
        if (list.isEmpty() || cur == list.first) return;
        if (cur == null) {
            cur = list.last;
        } else {
        cur = cur.prev;
        }
    }
    public void next()
    {
        if (atEnd()) {
            return;
        }
        cur = cur.next;
    }

    public int getValue()
    {
        if (atEnd()) {
            return -1;
        }
        else
            return cur.data;
    }

    public boolean setValue(int x)
    {
        if (atEnd()) {
            return false;
        }
        else {
            cur.data = x;
            return true;
        }
    }

    public int delete()
    {
        if (atEnd()) {
            return -1;
        }
        
        int temp = cur.data;

        if (cur == list.first) {
            list.first = cur.next;
            if (cur.next != null) {
                cur.next.prev = null;
            }
        } else {
            cur.prev.next = cur.next;
        }

        if (cur == list.last) {
            list.last = cur.prev;
            if (cur.prev != null) {
                cur.prev.next = null;
            }
        } else {
            cur.next.prev = cur.prev;
        }

        cur = cur.next;
        return temp;
    }

    public void insertBefore(int x)
    {
        DNode newNode = new DNode(x);

        if (atEnd()) {
            if (list.isEmpty()) {
                list.first = list.last = newNode;
            } else {
                newNode.prev = list.last;
                list.last.next = newNode;
                list.last = newNode;
            }
            return;
        }
        newNode.prev = cur.prev;
        newNode.next = cur;
        if (cur == list.first) {
            list.first = newNode;
        } else {
            cur.prev.next = newNode;
        }
        cur.prev = newNode;
    }

    public boolean insertAfter(int x)
    {
        if (atEnd()) {
            return false;
        }

        DNode newNode = new DNode(x);
        newNode.prev = cur;
        newNode.next = cur.next;
        if (cur == list.last) {
            list.last = newNode;
        } else {
            cur.next.prev = newNode;
        }
        cur.next = newNode;
        return true;
    }
}