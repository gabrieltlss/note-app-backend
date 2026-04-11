export const asyncHandler =
    (fn: any) => (req: any, res: any, next: any) =>
        Promise.resolve(fn(req, res, next)).catch(next);

// Preciso entender o que este código faz.