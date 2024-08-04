// Vector structure
class Vector
{
    constructor(x, y, z)
    {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

// Function to create a vector
export function vectorize(x, y, z)
{
    return new Vector(x, y, z);
}

// Function to normalize a vector
export function normalizeVector(v)
{
    let denominator = Math.sqrt(dot(v, v));
    return vectorize(v.x / denominator, v.y / denominator, v.z / denominator);
}

// Function to add two vectors
export function vecAdd(v1, v2)
{
    return vectorize(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
}

// Function to subtract one vector from another
export function vecSubtract(v1, v2)
{
    return vectorize(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
}

// Function to calculate the dot product of two vectors
export function dot(v1, v2)
{
    return (v1.x * v2.x) + (v1.y * v2.y) + (v1.z * v2.z);
}

export function reflectVector(v, n)
{
    const dotProduct = dot(v, n);
    return vectorize(v.x - 2 * dotProduct * n.x, v.y - 2 * dotProduct * n.y, v.z - 2 * dotProduct * n.z);
}

// Function to calculate the cross product of two vectors
export function crossProduct(v1, v2)
{
    return vectorize((v1.y * v2.z) - (v1.z * v2.y), (v1.z * v2.x) - (v1.x * v2.z), (v1.x * v2.y) - (v1.y * v2.x));
}

// Function to calculate the scalar product of a vector and a scalar
export function scalarProduct(v, a)
{
    return vectorize(v.x * a, v.y * a, v.z * a);
}
