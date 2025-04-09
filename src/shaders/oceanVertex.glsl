uniform float uT;
uniform float uLambda;
uniform vec2 uWaveVector;
uniform float uAmplitude;
uniform float uOmega;
uniform float uPositionScale;

varying vec3 vPos;

const float PI = 3.1415926535;
const float PI2 = 2.0 * PI;

void main() {
    float lambda = uLambda;
    float waveVectorMag = PI2 / lambda;
    vec2 waveVector = normalize(uWaveVector) * waveVectorMag;
    float amplitude = uAmplitude;
    float omega = uOmega;
    vec3 scaledPos = position * uPositionScale;
    vec2 xy = position.xy - waveVector / waveVectorMag * amplitude * sin(dot(waveVector, scaledPos.xy) - omega * uT);
    float z = amplitude * cos(dot(waveVector, scaledPos.xy) - omega * uT);
    vec3 positionDisplaced = vec3(xy, z);
    vec4 positionProjected = projectionMatrix * viewMatrix * modelMatrix * vec4(positionDisplaced, 1.0);
    vPos = positionDisplaced;
    gl_Position = positionProjected;
}
