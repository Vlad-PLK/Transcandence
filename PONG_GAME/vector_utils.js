// Vector structure
class Vector {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

// Function to create a vector
function vectorize(x, y, z) {
    return new Vector(x, y, z);
}

// Function to normalize a vector
function normalizeVector(v) {
    let denominator = Math.sqrt(dot(v, v));
    return vectorize(v.x / denominator, v.y / denominator, v.z / denominator);
}

// Function to add two vectors
function vecAdd(v1, v2) {
    return vectorize(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
}

// Function to subtract one vector from another
function vecSubtract(v1, v2) {
    return vectorize(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
}

// Function to calculate the dot product of two vectors
function dot(v1, v2) {
    return (v1.x * v2.x) + (v1.y * v2.y) + (v1.z * v2.z);
}

// Function to calculate the cross product of two vectors
function crossProduct(v1, v2) {
    return vectorize(
        (v1.y * v2.z) - (v1.z * v2.y),
        (v1.z * v2.x) - (v1.x * v2.z),
        (v1.x * v2.y) - (v1.y * v2.x)
    );
}

// Function to calculate the scalar product of a vector and a scalar
function scalarProduct(v, a) {
    return vectorize(v.x * a, v.y * a, v.z * a);
}
