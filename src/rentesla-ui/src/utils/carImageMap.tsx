const IMAGE_MAP: Record<string, string> = {
    'Tesla Model S': '/images/tesla-model-s.jpg',
    'Tesla Model 3': '/images/tesla-model-3.jpg',
    'Tesla Model Y': '/images/tesla-model-y.jpg',
    'Tesla Model X': '/images/tesla-model-x.jpg',
    'Tesla Cybertruck': '/images/tesla-cybertruck.jpg',
};

/**
* Returns the URL for the given model name, or undefined if not found.
*/
export function getImageForCarModel(name: string): string | undefined {
    return IMAGE_MAP[name];
}