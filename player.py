class Nodo:
    def __init__(self, cancion):
        self.cancion = cancion
        self.siguiente = None
        self.anterior = None

class ReproductorMusica:
    def __init__(self):
        self.cabeza = None
        self.actual = None
        self.cola = None
        self.tamano = 0

    def agregar_cancion(self, cancion):
        nuevo_nodo = Nodo(cancion)
        if not self.cabeza:
            self.cabeza = nuevo_nodo
            self.cola = nuevo_nodo
            self.actual = nuevo_nodo
        else:
            nuevo_nodo.anterior = self.cola
            self.cola.siguiente = nuevo_nodo
            self.cola = nuevo_nodo
        self.tamano += 1

    def reproducir_actual(self):
        if not self.actual:
            return "No hay canciones en la lista"
        return f"▶ Reproduciendo: {self.actual.cancion}"

    def siguiente_cancion(self):
        if not self.actual:
            return "No hay canciones en la lista"
        if self.actual.siguiente:
            self.actual = self.actual.siguiente
            return self.reproducir_actual()
        return "Final de la lista de reproducción"

    def cancion_anterior(self):
        if not self.actual:
            return "No hay canciones en la lista"
        if self.actual.anterior:
            self.actual = self.actual.anterior
            return self.reproducir_actual()
        return "Ya estás en la primera canción"

    def mostrar_lista(self):
        if not self.cabeza:
            return "Lista de reproducción vacía"
        
        actual = self.cabeza
        lista = []
        while actual:
            marcador = "▶" if actual == self.actual else " "
            lista.append(f"{marcador} {actual.cancion}")
            actual = actual.siguiente
        return "\n".join(lista)

# Ejemplo de uso
if __name__ == "__main__":
    reproductor = ReproductorMusica()
    
    # Agregamos algunas canciones de ejemplo
    canciones = [
        "Bohemian Rhapsody - Queen",
        "Hotel California - Eagles",
        "Imagine - John Lennon",
        "Billie Jean - Michael Jackson",
        "Sweet Child O' Mine - Guns N' Roses"
    ]
    
    for cancion in canciones:
        reproductor.agregar_cancion(cancion)
    
    # Interfaz de usuario simple
    while True:
        print("\n=== Reproductor de Música ===")
        print("\nLista de reproducción:")
        print(reproductor.mostrar_lista())
        print("\nControles:")
        print("1. Reproducir actual")
        print("2. Siguiente canción")
        print("3. Canción anterior")
        print("4. Salir")
        
        opcion = input("\nSelecciona una opción (1-4): ")
        
        if opcion == "1":
            print(reproductor.reproducir_actual())
        elif opcion == "2":
            print(reproductor.siguiente_cancion())
        elif opcion == "3":
            print(reproductor.cancion_anterior())
        elif opcion == "4":
            print("¡Hasta luego!")
            break
        else:
            print("Opción no válida. Por favor, intenta de nuevo.")