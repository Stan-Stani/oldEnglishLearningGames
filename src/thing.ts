class User {
    #id: string;
    name: string;
    age: number;

    constructor(id: string, name: string, age: number) {
        this.#id = id;
        this.name = name;
        this.age = age;
    }

    getId(): string {
        return this.#id;
    }
}

function createDictionary<
    TItem,
    TKey extends PropertyKey,
    TGetter extends (item: TItem) => TKey
>(
    items: readonly TItem[],
    getKey: TGetter
): Record<TKey, TItem> {
    const result = {} as Record<TKey, TItem>;
    
    for (const item of items) {
        const key = getKey(item);
        result[key] = item;
    }
    
    return result;
}

// Example usage
const users = [
    new User("u1", "Alice", 25),
    new User("u2", "Bob", 30)
] as const;

// To get literal types from getId, we need to specify them:
type ValidIds = "u1" | "u2";
const userDict = createDictionary(users, (user): ValidIds => user.getId() as ValidIds);

// Now these will actually error at compile time:
userDict.u1;  // OK
userDict.u2;  // OK
userDict.u3;  // Error: Property 'u3' does not exist on type...

// For cases where we want to infer the literals automatically:
const usersByName = createDictionary(users, 
    (user) => user.name as "Alice" | "Bob"
);
usersByName.Alice;  // OK
usersByName.Bob;    // OK
usersByName.Carol;  // Error

// Generic class approach for automatic inference:
class UserWithId<TId extends string> {
    #id: TId;
    name: string;
    age: number;

    constructor(id: TId, name: string, age: number) {
        this.#id = id;
        this.name = name;
        this.age = age;
    }

    getId(): TId {
        return this.#id;
    }
}

const usersWithId = [
    new UserWithId("u1", "Alice", 25),
    new UserWithId("u2", "Bob", 30)
] as const;

// Now this works with automatic literal type inference
const userDictAuto = createDictionary(usersWithId, user => user.getId());

