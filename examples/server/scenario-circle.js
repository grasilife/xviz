// Copyright (c) 2019 Uber Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/* Generated XVIZ for a scenario that is a
 * circular path on a grid
 * - no start end time in metadata
 * - stream metadata for coordinate & styling
 */

const ROTATIONS_PER_SECOND = 10;
const DEG_1_AS_RAD = Math.PI / 180;
const DEG_90_AS_RAD = 90 * DEG_1_AS_RAD;

const circle_metadata = {
  type: 'xviz/metadata',
  data: {
    version: '2.0.0',
    streams: {
      ['/vehicle_pose']: {},
      ['/circle']: {
        coordinate: 'IDENTITY',
        stream_style: {
          fill_color: [200, 0, 70, 128]
        }
      },
      ['/ground_grid_h']: {
        coordinate: 'IDENTITY',
        stream_style: {
          stroked: true,
          stroke_width: 0.2,
          stroke_color: [0, 255, 0, 128]
        }
      },
      ['/ground_grid_v']: {
        coordinate: 'IDENTITY',
        stream_style: {
          stroked: true,
          stroke_width: 0.2,
          stroke_color: [0, 255, 0, 128]
        }
      }
    }
  }
};

// Special metadata for the non-live test case
const circle_log_metadata = JSON.parse(JSON.stringify(circle_metadata));
circle_log_metadata.data.log_info = {
  log_start_time: 1000,
  log_end_time: 6000
};

class CircleScenario {
  constructor(ts) {
    // Get starting timestamp
    this.timestamp = ts || Date.now() * 1000;
  }

  getFrame(timeOffset) {
    return this._getFrame(timeOffset);
  }

  _getFrame(timeOffset) {
    const timestamp = this.timestamp + timeOffset;

    return {
      type: 'xviz/state_update',
      data: {
        update_type: 'snapshot',
        updates: [
          {
            timestamp,
            poses: this._drawPose(timestamp),
            primitives: this._drawGrid()
          }
        ]
      }
    };
  }

  _drawPose(timestamp) {
    const degreesPerSecond = 360 / ROTATIONS_PER_SECOND;
    const currentDegrees = timestamp * degreesPerSecond;
    const angle = currentDegrees * DEG_1_AS_RAD;

    // console.log(`${degreesPerSecond} Time: ${timestamp} => ${currentDegrees} => Angle: ${angle}`);
    return {
      '/vehicle_pose': {
        timestamp,
        // Make the car orient the the proper direction on the circle
        orientation: [0, 0, DEG_90_AS_RAD + currentDegrees * DEG_1_AS_RAD],
        position: [30 * Math.cos(angle), 30 * Math.sin(angle), 0]
      }
    };
  }

  _drawGrid() {
    const grid = [-40, -30, -20, -10, 0, 10, 20, 30, 40];

    const gridXVIZ_h = grid.map(x => {
      return {
        vertices: [x, -40, 0, x, 40, 0]
      };
    });

    const gridXVIZ_v = grid.map(y => {
      return {
        vertices: [-40, y, 0, 40, y, 0]
      };
    });

    return {
      ['/ground_grid_h']: {
        polylines: gridXVIZ_h
      },
      ['/ground_grid_v']: {
        polylines: gridXVIZ_v
      },
      ['/circle']: {
        circles: [
          {
            center: [0.0, 0.0, 0.0],
            radius: 30.0
          }
        ]
      }
    };
  }
}

module.exports = {
  circle: {
    metadata: circle_metadata,
    generator: new CircleScenario()
  },
  circle_log: {
    metadata: circle_log_metadata,
    generator: new CircleScenario(circle_log_metadata.data.log_info.log_start_time)
  }
};
