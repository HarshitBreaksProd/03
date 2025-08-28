import csv
import itertools
import os

def generate_arrays_csv():
    """
    Generates multiple CSV files containing all 1,728,000 unique array permutations
    based on the specified group rules, with each file containing up to 100,000 arrays.
    """
    letters = ['b', 'c', 'd', 'e', 'f']
    
    # --- The three groups of indexes ---
    group1_indexes = [0, 3, 6, 9, 12]
    group2_indexes = [1, 4, 7, 10, 13]
    group3_indexes = [2, 5, 8, 11, 14]

    # Pre-calculate all 120 permutations for the letters
    perms = list(itertools.permutations(letters))
    
    # --- File splitting logic ---
    output_dir = 'output_chunks'
    os.makedirs(output_dir, exist_ok=True)
    file_count = 1
    line_count = 0
    max_lines_per_file = 100000
    total_count = 0

    # Open the first CSV file for writing
    file_path = os.path.join(output_dir, f'all_unique_arrays_{file_count}.csv')
    f = open(file_path, 'w', newline='')
    writer = csv.writer(f)
    
    try:
        # Loop through every combination of permutations for the three groups
        for p1 in perms:
            for p2 in perms:
                for p3 in perms:
                    if line_count >= max_lines_per_file:
                        f.close()
                        file_count += 1
                        file_path = os.path.join(output_dir, f'all_unique_arrays_{file_count}.csv')
                        f = open(file_path, 'w', newline='')
                        writer = csv.writer(f)
                        line_count = 0

                    # Create a placeholder for the final 15-element array
                    final_array = [''] * 15
                    
                    # Place the letters from each permutation into their correct group slots
                    for i in range(5):
                        final_array[group1_indexes[i]] = p1[i]
                        final_array[group2_indexes[i]] = p2[i]
                        final_array[group3_indexes[i]] = p3[i]
                    
                    # Write the fully constructed array to the CSV file
                    writer.writerow(final_array)
                    line_count += 1
                    total_count += 1
    finally:
        if f and not f.closed:
            f.close()

    print(f"✅ Successfully generated {file_count} CSV files in '{output_dir}' with a total of {total_count} unique arrays.")

# Run the function
generate_arrays_csv()