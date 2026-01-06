# 🚀 Como hacer un commit
git add .
git commit -m "Agregada nueva funcionalidad X"
git push origin feature/nueva-funcionalidad

# 🚀 Como hacer descartar todos
git reset --hard

# 🚀 Como bajar los ulitmos cambios(recuerda que antes de bajar debes agregar tus cambios, si no los pierdes git add .)
git status
git checkout main
git pull

# 🚀 Como crear un rama
git checkout -b feature/nueva-funcionalidad

# 🚀 Como subir la primera vez a la rama
git push --set-upstream origin test/prueba-rsoto

# 🚀 Convencion rama
Tipo de Rama	Convención	Propósito
Nueva funcionalidad	feature/nueva-funcionalidad	Desarrollar una nueva característica
Corrección de errores	fix/error-en-login	Solucionar un bug o error
Mejoras pequeñas	enhancement/mejora-en-ui	Mejoras en código o interfaz
Pruebas	test/agregar-tests	Agregar o modificar pruebas
Hotfix (parche urgente)	hotfix/error-crítico	Corrección urgente en producción
Documentación	docs/actualizar-readme	Cambios en documentación

# 🚀 hacer pull request
git checkout main
git pull origin main
git merge feature/nueva-funcionalidad
git push origin main

# 🚀 como te cambias de ramas
git checkout nombre de la rama

# 🚀 hacer pull request
Ir a GitHub → Pull Requests.
Clic en New Pull Request.
Seleccionar feature/nueva-funcionalidad contra main.
Agregar una descripción clara y asignar un revisor.
Crear el PR.

modificado por rafa


# Comentarios generales
comentario prueba


# Actualizar en ramas local las modificaciones subidas de ramas remotas
# Escenario:
Tienes dos ramas:

    main: rama principal.
    feature-login: tu rama de trabajo donde estás desarrollando algo nuevo.

Tu objetivo: traer todos los cambios más recientes de main a feature-login.

Paso a paso:

Ir a tu rama de trabajo:

    git checkout feature-login
    
Traer los cambios del repositorio remoto:

    git fetch origin
    Esto actualiza tu conocimiento local de origin/main, pero no modifica aún tu rama.

Fusionar los cambios de main en tu rama:

    git merge origin/main
    Esto combina los últimos cambios que están en origin/main con los que tienes en feature-login.

Resultado:
Después de esto, tu rama feature-login tendrá todos los cambios que están en main, más tus propios cambios.


