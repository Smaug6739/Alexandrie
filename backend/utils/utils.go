package utils

func IfNotNilOrDefault[T comparable](newValue any, defaultValue T) T {
	// Si newValue est un pointeur et non nil, on le dé-référence
	if v, ok := newValue.(*T); ok && v != nil {
		return *v
	}

	// Si newValue est une valeur directe non nulle (cas des strings par exemple), on le retourne
	if v, ok := newValue.(T); ok {
		return v
	}

	// Sinon, on retourne la valeur par défaut
	return defaultValue
}
