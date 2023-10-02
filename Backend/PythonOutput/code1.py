def selection_sort(numbers):
    # Traverse through all array elements
    for i in range(len(numbers)):
        # Find the minimum element in remaining unsorted array
        min_index = i
        for j in range(i+1, len(numbers)):
            if numbers[min_index] > numbers[j]:
                min_index = j
                
        # Swap the found minimum element with the first element
        numbers[i], numbers[min_index] = numbers[min_index], numbers[i]
        
    return numbers

# Example usage
numbers = [64, 25, 12, 22, 11]
sorted_numbers = selection_sort(numbers)
print(sorted_numbers)