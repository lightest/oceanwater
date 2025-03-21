void main() {
    vec4 position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    gl_Position = position;
}
