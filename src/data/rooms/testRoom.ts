import { Room } from "../../types";

/**************
 * ROOM SHAPE
 **************
 4          [ ][ ][ ]
 3          [ ][ ][ ]
 2    [ ][ ][ ]
 1 [ ][ ]
 0 [ ][ ]   
    0  1  2  3  4  5
 */

export const test_rooms: Room[] = [
  {
    id: "1",
    type: "room",
    offset: { x: 0, y: 0, z: 0 },
    length: 2,
    width: 2,
    props: [
      {
        id: "stairs",
        position: { x: 0.5, y: 0, z: 0.5 },
        rotation: 0
      }
    ],
    doors: [
      {
        type: "single",
        position: { x: 1, y: 1 },
        direction: "top"
      }
    ]
  },
  {
    id: "2",
    type: "corridor",
    offset: { x: 1, y: 0, z: 2 },
    length: 1,
    width: 3,
  },
  {
    id: "3",
    type: "room",
    offset: { x: 3, y: 0, z: 3 },
    length: 2,
    width: 3,
  },
]
