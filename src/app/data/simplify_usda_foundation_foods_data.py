import json

data_dir = 'src/app/data/'

# Simple function to map USDA categories to broader groups
def map_category(raw_category):
    if not raw_category:
        return "Other"
    
    category = raw_category.lower()
    if "meat" in category or "poultry" in category or "beef" in category:
        return "Meat"
    if "fish" in category or "seafood" in category:
        return "Seafood"
    if "vegetable" in category or "legume" in category:
        return "Vegetable"
    if "fruit" in category:
        return "Fruit"
    if "grain" in category or "cereal" in category:
        return "Grain"
    if "dairy" in category:
        return "Dairy"
    if "oil" in category or "fat" in category:
        return "Oil"
    if "nut" in category or "seed" in category:
        return "Nuts/Seeds"
    if "spice" in category or "herb" in category:
        return "Spices/Herbs"
    return "Other"

# Calculate a High Protein, Moderate Fat Score
def calculate_high_protein_fat_score(protein, fat, moisture):
    return round((protein * 2) + (fat * 1.5) - (moisture * 0.5), 2)

# Load raw Foundation Foods JSON
with open(f'{data_dir}foundationFoods.json', 'r') as f:
    data = json.load(f)

simplified = []

energy_names = [
    "Energy",
    "Energy (Atwater General Factors)",
    "Energy (Atwater Specific Factors)"
]

expected_nutrients = {
    'Protein': ('protein', 'g'),
    'Total lipid (fat)': ('fat', 'g'),
    'Calcium, Ca': ('calcium', 'mg'),
    'Energy': ('kcals', 'kcal'),
    'Phosphorus, P': ('phosphorus', 'mg'),
    'Water': ('moisture', 'g')
}

kj_factor = 4.184

for food in data['FoundationFoods']:
    food_id = food.get('fdcId')
    description = food.get('description')
    raw_category = food.get('foodCategory', {}).get('description', 'Unknown')
    broad_category = map_category(raw_category)

    nutrient_values = {v[0]: 0 for v in expected_nutrients.values()}


    for nutrient in food.get('foodNutrients', []):
        nutrient_info = nutrient.get('nutrient', {})
        name = nutrient_info.get('name')
        unit = nutrient_info.get('unitName')
        amount = nutrient.get('amount')
        unitType = unit.lower()

        if name in energy_names:
            # Convert kilojoules to kilocalories
            if unitType == 'kj':
                amount = amount / kj_factor
                unitType = 'kcal'
            # Normalize the name to match the expected nutrient name of Energy
            name = "Energy"

        if name in expected_nutrients:
            field_name, expected_unit = expected_nutrients[name]

            if unitType != expected_unit:
                print(f"Warning: {description} - {name} unit mismatch! Expected {expected_unit}, found {unit}. Skipping...")
                continue

            nutrient_values[field_name] = amount

    # Filter: Keep foods with some protein or fat
    if nutrient_values['protein'] > 0 or nutrient_values['fat'] > 0:
        simplified.append({
            'id': str(food_id),
            'label': description,
            'category': raw_category,
            'group': broad_category,
            **nutrient_values,
            'highProteinFatScore': calculate_high_protein_fat_score(
                nutrient_values['protein'],
                nutrient_values['fat'],
                nutrient_values['moisture']
            )
        })

# Sort alphabetically
simplified = sorted(simplified, key=lambda x: x['label'])

# Save simplified JSON
with open(f'{data_dir}foundationFoodsSimplified.json', 'w') as f:
    json.dump(simplified, f, indent=2)

print(f"Simplified {len(simplified)} foods kept and sorted!")