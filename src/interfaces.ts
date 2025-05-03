export class GerstnerWaveParams
{
    lambda: number;
    // waveVector: Float32Array;
    waveVectorX: number;
    waveVectorY: number;
    amplitude: number;
    omega: number;
    phase: number;

    // Total of 6 numeric float32 parameters (2 in array);
    static FLOAT_PARAMS = 6;

    constructor()
    {
        this.lambda = 7.0;
        // this.waveVector = new Float32Array([1.0, 0.0]);

        // Using separate values instead of Float32Array, since lil-gui can't use arrays.
        // Normally, we should go with a Float32Array for vectors.
        this.waveVectorX = 1.0;
        this.waveVectorY = 0.0;
        this.amplitude = 0.01;
        this.omega = 1.0;
        this.phase = 1.0;
    }
}

export class FFTWaveParams
{
    amplitude: number;
    lambda: number; // For wavenumber.
    waveVectorX: number;
    waveVectorY: number;
    windSpeed: number;
    windDirectionX: number;
    windDirectionY: number;

    static FLOAT_PARAMS = 7;

    constructor()
    {
        this.amplitude = 0.01;
        this.lambda = 7.0;
        // Using separate values instead of Float32Array, since lil-gui can't use arrays.
        // Normally, we should go with a Float32Array for vectors.
        this.waveVectorX = 1.0;
        this.waveVectorY = 0.0;
        this.windSpeed = 1.0;
        this.windDirectionX = 1.0;
        this.windDirectionY = 0.0;
    }
}
