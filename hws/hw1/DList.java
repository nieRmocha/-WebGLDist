class DList
{
    public DNode first;
    public DNode last;

    public DList(){first = null; last = null;}
    public boolean isEmpty(){return first == null;}

    public void insertAtFront(int x){
        DNode newNode = new DNode(x);
        if(isEmpty())
        {
            last = newNode;
        }
        else
        {
            first.prev = newNode;
        }
        newNode.next = first;
        first = newNode;
    }

    public void insertAtEnd(int x)
    {
        DNode newNode = new DNode(x);
        if(isEmpty())
        {
            first = newNode;
        }
        else
        {
            last.next = newNode;
        }
        newNode.prev = last;
        last = newNode;
    }

    public int deleteFromFront()
    {
        if (isEmpty()) {
            return -1;
        }
        int temp = first.data;
        
        if (first.next == null) {
            last = null;
        }
        else
            first.next.prev = null;
        first = first.next;
        return temp;
    }

    public int deleteFromEnd()
    {
        if (isEmpty()) {
            return -1;
        }
        int temp = last.data;
        
        if (last.prev == null) {
            first = null;
        }
        else
            last.prev.next = null;
        last = last.prev;
        return temp;

    }

    public DIter getIter()
    {
        DIter iter = new DIter(this);
        return iter;
    }
}