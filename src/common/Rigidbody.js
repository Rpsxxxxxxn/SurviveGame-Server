module.exports = class Rigidbody {
    constructor(mass, velocity, acceleration) {
        this.mass = mass;
        this.velocity = velocity;
        this.acceleration = acceleration;
    }

    update() {
        this.velocity.add(this.acceleration);
    }

    applyForce(force) {
        this.acceleration.add(force.div(this.mass));
    }
}