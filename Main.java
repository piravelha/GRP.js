public class Main {
    public static void main(String[] args) {
        String input = "hello how are you Contestant";
        String result = extractFirstFourWords(input);
        System.out.println(result); // Output: "hello how are you"
    }

    public static String extractFirstFourWords(String s) {
        int wordCount = 0;
        int length = s.length();
        int i = 0;
        
        // Iterate through the string to find the position after the fourth word
        while (i < length && wordCount < 4) {
            // Skip over the characters of the current word
            while (i < length && s.charAt(i) != ' ') {
                i++;
            }
            
            // Skip the spaces between words
            while (i < length && s.charAt(i) == ' ') {
                i++;
            }
            
            wordCount++;
        }
        
        // Return the substring from the beginning to the position after the fourth word
        return s.substring(0, i).trim();
    }
}
