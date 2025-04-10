uniform float uT;
uniform float uLambda;
uniform vec2 uWaveVector;
uniform float uAmplitude;
uniform float uOmega;
uniform float uPositionScale;
uniform float uRepeatPeriod;

// struct GerstnerWaveParams {
//     float lambda;
//     vec2 waveVector;
//     float amplitude;
//     float omega;
//     float phase;
// };

// uniform GerstnerWaveParams uGerstnerWaveParams[5];
uniform float uGerstnerWaveParams[30];

varying vec3 vPos;

const float PI = 3.1415926535;
const float PI2 = 2.0 * PI;
const float g = 9.8;

void main()
{
    vec3 scaledPos = position * uPositionScale;
    vec2 xy = vec2(0.0);
    float z = 0.0;
    float omegaInitial = PI2 / uRepeatPeriod;

    // for (int i = 0; i < 5; i++)
    // {
    //     float lambda = uGerstnerWaveParams[i].lambda;
    //     float waveVectorMag = PI2 / lambda;
    //     vec2 waveVector = normalize(uGerstnerWaveParams[i].waveVector) * waveVectorMag;
    //     float amplitude = uGerstnerWaveParams[i].amplitude;
    //     float omega = uGerstnerWaveParams[i].omega;
    //     float phase = uGerstnerWaveParams[i].phase;
    //     xy += position.xy - waveVector / waveVectorMag * amplitude * sin(dot(waveVector, scaledPos.xy) - omega * uT);
    //     z += amplitude * cos(dot(waveVector, scaledPos.xy) - omega * uT);
    // }

    for (int i = 0; i < 30; i+=6)
    {
        float lambda = uGerstnerWaveParams[i];
        float waveVectorMag = PI2 / lambda;
        vec2 waveVector = normalize(vec2(uGerstnerWaveParams[i + 1], uGerstnerWaveParams[i + 2])) * waveVectorMag;
        float amplitude = uGerstnerWaveParams[i + 3];
        // float omega = uGerstnerWaveParams[i + 4];
        float omega = floor(sqrt(g * waveVectorMag) / omegaInitial) * omegaInitial;
        float phase = uGerstnerWaveParams[i + 5];
        xy += position.xy - waveVector / waveVectorMag * amplitude * sin(dot(waveVector, scaledPos.xy) - omega * uT + phase);
        z += amplitude * cos(dot(waveVector, scaledPos.xy) - omega * uT + phase);
    }

    vec3 positionDisplaced = vec3(xy, z);
    vec4 positionProjected = projectionMatrix * viewMatrix * modelMatrix * vec4(positionDisplaced, 1.0);
    vPos = positionDisplaced;
    gl_Position = positionProjected;
}
