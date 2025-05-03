uniform float uT;
uniform float uLambda;
uniform vec2 uWaveVector;
uniform float uAmplitude;
uniform float uOmega;
uniform float uPositionScale;
uniform float uRepeatPeriod;

uniform float uFFTWaveParams[7];

varying vec3 vPos;

const float PI = 3.1415926535;
const float PI2 = 2.0 * PI;
const float g = 9.8;

float phillipsSpectrum(float A, vec2 waveVector, float waveVectorMag, float largestWave, vec2 windDirection) {
    float spectrumValue = A * ( exp(-1.0 / pow(waveVectorMag * largestWave, 2.0)) / pow(waveVectorMag, 4.0) ) * pow(dot(waveVector, windDirection), 2.0);

    return spectrumValue;
}

void main()
{
    vec3 scaledPos = position * uPositionScale;
    vec2 xy = vec2(0.0);
    float z = 0.0;
    float omegaInitial = PI2 / uRepeatPeriod;

    float A = uFFTWaveParams[0]; // Numeric constant.
    float lambda = uFFTWaveParams[1];
    float waveVectorMag = PI2 / lambda;
    vec2 waveVector = normalize(vec2(uFFTWaveParams[2], uFFTWaveParams[3])) * waveVectorMag;
    float windSpeed = uFFTWaveParams[4];
    vec2 windDirection = normalize(vec2(uFFTWaveParams[5], uFFTWaveParams[6]));
    float L = pow(windSpeed, 2.0) / g; // Largest possible wave arising from a continuous windSpeed.

    float spectrumValue = phillipsSpectrum(A, waveVector, waveVectorMag, L, windDirection);

    vec3 positionDisplaced = vec3(xy, z);
    vec4 positionProjected = projectionMatrix * viewMatrix * modelMatrix * vec4(positionDisplaced, 1.0);
    vPos = positionDisplaced;
    gl_Position = positionProjected;
}
