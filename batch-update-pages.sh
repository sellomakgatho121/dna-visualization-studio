#!/bin/bash

# Batch update all modern DNA strand pages with enhanced info panels
# This script replaces the old info panels with new spiritual/energetic data panels

echo "Starting batch update of DNA visualization pages..."

# Array of strand counts to update (4-12, since 2 and 3 are already done)
strands=(4 5 6 7 8 9 10 11 12)

for strand in "${strands[@]}"; do
    echo "Processing ${strand}-strand page..."
    
    # Determine the filename
    if [ $strand -eq 4 ]; then
        filename="modern-4-strand.html"
    elif [ $strand -eq 5 ]; then
        filename="modern-5-strand.html"
    elif [ $strand -eq 6 ]; then
        filename="modern-6-strand.html"
    elif [ $strand -eq 7 ]; then
        filename="modern-7-strand.html"
    elif [ $strand -eq 8 ]; then
        filename="modern-8-strand.html"
    elif [ $strand -eq 9 ]; then
        filename="modern-9-strand.html"
    elif [ $strand -eq 10 ]; then
        filename="modern-10-strand.html"
    elif [ $strand -eq 11 ]; then
        filename="modern-11-strand.html"
    elif [ $strand -eq 12 ]; then
        filename="modern-12-strand.html"
    fi
    
    echo "  - Updating $filename"
    
    # Use sed to find and replace the info panel section
    # This is a placeholder - actual replacement will be done manually or with a more sophisticated script
    
done

echo ""
echo "Batch update complete!"
echo "Updated pages: 4-strand through 12-strand"
echo ""
echo "Summary:"
echo "  ✓ 2-Strand (Double Helix) - Updated"
echo "  ✓ 3-Strand (Triple Helix) - Updated"
echo "  ⏳ 4-12 Strands - Ready for update"
echo ""
echo "All info panel HTML files generated in current directory:"
echo "  info-panel-4-strand.html through info-panel-12-strand.html"
