import ECS from '../ecs.js'
import tap from 'tap'


const w = ECS.createWorld()

const e = ECS.createEntity(w)

tap.equal(w.entities.length, 1)

const someNonEntity = { }
ECS.removeEntity(w, someNonEntity)

tap.equal(w.entities.length, 1, 'removing some other random object doesnt have any effect')

ECS.removeEntity(w, e)
tap.equal(w.entities.length, 0, 'entity gets removed from the world')



const e2 = ECS.createEntity(w)

ECS.getEntities(w, [ 'a' ])  // filter 1
ECS.getEntities(w, [ 'a', 'b' ])

ECS.addComponentToEntity(w, e2, 'a', { a: 23 })
ECS.addComponentToEntity(w, e2, 'b', { b: 64 })

tap.equal(w.filters['a'].length, 1)
tap.equal(w.filters['a,b'].length, 1)

ECS.removeEntity(w, e2)

tap.equal(w.filters['a'].length, 0, 'removing entities removes them from all matching filters')
tap.equal(w.filters['a,b'].length, 0, 'removing entities removes them from all matching filters')



// while iterating over entities, removing an unvisited entity prevents it from being processed

const w2 = ECS.createWorld()

const e3 = ECS.createEntity(w2)
ECS.addComponentToEntity(w2, e3, 'position', 'e3')

const e4 = ECS.createEntity(w2)
ECS.addComponentToEntity(w2, e4, 'position', 'e4')

const e5 = ECS.createEntity(w2)
ECS.addComponentToEntity(w2, e5, 'position', 'e5')

let i = 0
const processed = { }

for (const entity of ECS.getEntities(w2, [ 'position'])) {
	processed[entity.position] = true

	// while processing the first entity in the list, remove the 2nd entity
	if (i == 0)
		ECS.removeEntity(w2, e4)

	i++
}

tap.same(processed, { 'e3': true, 'e5': true }, 'e4 was not processed because it was removed')
