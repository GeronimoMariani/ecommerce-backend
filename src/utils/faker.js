import { Faker, es, en} from "@faker-js/faker";

const faker = new Faker({
    locale: [es, en]
});

export const generateProduct = () => {
    return {
        title: faker.commerce.productName(),
        code: faker.string.alphanumeric({length: 10}).toUpperCase(),
        category: faker.commerce.productMaterial(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        stock: faker.number.int({min: 0, max: 100}),
        id: faker.database.mongodbObjectId(),
        thumbnail: faker.image.url()
    }
}