public class RS {
    public static void sort(int[] a, int n) {
        int max = a[0];
        for (int i = 1; i < n; i++) {
            if (a[i] > max) {
                max = a[i];
            }
        }

        int[] output = new int[n];
        int exp = 1;

        while (max / exp > 0) {
            int[] count = new int[10];

            for (int i = 0; i < n; i++) {
                int digit = (a[i] / exp) % 10;
                count[digit]++;
            }

            for (int i = 1; i < 10; i++) {
                count[i] += count[i - 1];
            }

            for (int i = n - 1; i >= 0; i--) {
                int digit = (a[i] / exp) % 10;
                output[--count[digit]] = a[i];
            }

            for (int i = 0; i < n; i++) {
                a[i] = output[i];
            }

            exp *= 10;
        }
    }
}