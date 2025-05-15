import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

public class As12 {
    public static void main(String[] args) throws IOException {
        BufferedReader reader = new BufferedReader(new FileReader("input.txt"));
        BufferedWriter writer = new BufferedWriter(new FileWriter("output.txt"));

        int n = Integer.parseInt(reader.readLine());
        MyQueue queue = new MyQueue();

        for (int i = 0; i < n; i++) {
            String line = reader.readLine();
            if (line.startsWith("e ")) {
                queue.enqueue(line.substring(2));
            } else if (line.equals("d")) {
                writer.write(queue.dequeue());
                writer.newLine();
            }
        }

        reader.close();
        writer.close();
    }
}