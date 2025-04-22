# Recipe Builder
This is a generalized meal recipe builder that will determine nutritional content based on the ingredients used.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

##  Data
The data set used in this application is the open Foundation Foods dataset published by the [USDA FoodData Central](https://fdc.nal.usda.gov/Foundation_Foods_Documentation)

### Data Transformation
The [simplify_usda_foundation_foods_data.py](src/app/data/simplify_usda_foundation_foods_data.py) script can be run against the Foundation Foods JSON dataset in order to simplify and flatten the data.

The [filter_pet_friendly_ingredients.py](src/app/data/filter_pet_friendly_ingredients.py) can be run against the output of the [simplify_usda_foundation_foods_data.py](src/app/data/simplify_usda_foundation_foods_data.py) to retrieve the ingredients that may be suitable for meals prepared for dogs and cats.
