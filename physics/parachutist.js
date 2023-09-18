import vector from "./vector";
export class parachutist {
  constructor(
    position,
    paratrooperMass,
    bagMass,
    paratRadius,
    temperature,
    windSpeed,
    windDirection,
    dragCoefficient,
    collision_duration
  ) {
    this.earth_mass = 5.9722e24 //kg
    this.earth_radius = 6353000 //m
    this.G = 6.6739e-11; // ثابت الجاذب الكوني 
    this.R_gas = 287.058; //specific gas constant for dry air
    this.gravityacc = 9.8;
    this.totalForce = vector.create(0, 0, 0);
    this.friction = vector.create(0, 0, 0);
    this.wind = vector.create(0, 0, 0);
    this.gravity = vector.create(0, 0, 0);
    this.acc = vector.create(0, 0, 0);
    this.velocity = vector.create(0, 0, 0);
    this.position = vector.create(position.x, position.y, position.z);
    this.intensity = 0;
    this.paratrooperMass = paratrooperMass;
    this.bagMass = bagMass;
    this.totalMass = paratrooperMass + bagMass;
    this.parachutArea = 0;
    this.dragCoefficient = dragCoefficient;
    this.paratRadius = paratRadius;
    this.windSpeed = windSpeed;
    this.windDirection = windDirection;
    this.temperature = temperature;
    this.collision_duration = collision_duration
    this.collision_int = 0
    this.landing_Safety = false
    this.rho = 0;
    this.tVelocity1 = 0;
    this.tVelocity2 = 0;
    this.counter = 0;
  }

  // مساحة المظلة
  Parachut_Area() {
    return this.parachutArea =
      Math.PI * this.paratRadius * this.paratRadius
  }

  //كثافة الهواء
  air_density() {
    let Temkelvin = this.temperature + 273.15;
    let P = 100; // الضغط المطلق يساوي 100 عند درجة الحرارة 25
    return this.rho =
      P / (this.R_gas * Temkelvin)
  }

  // قوة الجاذبية
  gravity_force() {
    var r = this.earth_radius + this.position._y
    return this.gravity = vector.create(
      0,
      - this.G * ((this.paratrooperMass + this.bagMass) * this.earth_mass) / (r * r),
      0)
  }

  friction_force() {
    let velocitySquere = this.velocity.squere();
    let normalize = this.velocity.normalize();

    return this.friction = vector.create(
      (- velocitySquere / 2) * this.dragCoefficient * this.air_density() * this.Parachut_Area() * normalize._x,
      (- velocitySquere / 2) * this.dragCoefficient * this.air_density() * this.Parachut_Area() * normalize._y,
      (- velocitySquere / 2) * this.dragCoefficient * this.air_density() * this.Parachut_Area() * normalize._z
    );
  }

  wind_velo() {
    let radians = this.windDirection * (Math.PI / 180);
    return vector.create(
      Number(Math.cos(radians).toFixed(3)) * this.windSpeed,
      0,
      Number(Math.sin(radians).toFixed(3)) * this.windSpeed
    );
  }

  wind_force() {
    let velocitySquere = this.wind_velo().squere();
    let normalize = this.wind_velo().normalize();

    return this.wind = vector.create(
      (velocitySquere / 2) * this.air_density() * this.Parachut_Area() * normalize._x,
      0,
      (velocitySquere / 2) * this.air_density() * this.Parachut_Area() * normalize._z
    );
  }

  // قانون السرعة الحدية قبل فتح المظلة
  terminal_Velocity1() {
    return this.tVelocity1 = -Math.sqrt(2 * this.gravityacc * this.position._y);
  }

  // قانون السرعة الحدية بعد فتح المظلة
  terminal_Velocity2() {
    this.tVelocity2 =
      -Math.sqrt(
        ((2 * this.totalMass * this.gravityacc)
          /
          (this.air_density() * this.Parachut_Area() * this.dragCoefficient)));
    if (isNaN(this.tVelocity2) || !Number.isFinite(this.tVelocity2)) {
      this.tVelocity2 = 0;
    }
    return this.tVelocity2
  }

  // التصادم
  collisionCheck() {
    if (this.position.getY() <= 45) {
      return true;
    } else {
      return false;
    }
  }

  collision_intensity() {
    let v = ((2 * this.velocity._y) / (this.gravityacc * this.collision_duration))
    this.collision_int = Math.pow(Math.abs(v), 2.5) * this.collision_duration
    if (this.collision_int < 350)
      this.landing_Safety = true
    else this.landing_Safety = false
    return this.collision_int
  }

  update(deltaTime, time) {
    if (this.counter == 0) {
      if (this.collisionCheck()) {
        this.velocity = vector.create(0, 0, 0);
        this.position = vector.create(this.position._x, this.position._y, this.position._z);
        this.counter++
        console.log(
          '\nvel =', this.velocity,
          '\npos =', this.position,
          '\nExperiment time =', time,
          "\nThe parachutist has landed and the experiment ended"
        )
      }
      else {
        this.gravity_force();
        this.friction_force();
        this.wind_force();
        this.totalForce = vector.create(
          this.friction._x + this.wind._x,
          this.gravity._y + this.friction._y,
          this.friction._z + this.wind._z
        );

        this.acc = vector.create(
          this.totalForce._x / (this.paratrooperMass + this.bagMass),
          this.totalForce._y / (this.paratrooperMass + this.bagMass),
          this.totalForce._z / (this.paratrooperMass + this.bagMass),
        );

        if ((this.tVelocity1 > (this.velocity._y - 1)) && this.friction._y < 1)
          this.acc._y = 0
        this.velocity.addTo(this.acc, deltaTime);
        this.position.addTo(this.velocity, deltaTime);

        console.log('\nacc =', this.acc,
          '\nwind force =', this.wind,
          '\ntotal force =', this.totalForce,
          '\nvel =', this.velocity,
          '\nfr =', this.friction,
          '\ngr =', this.gravity,
          '\nrho =', this.rho,
          '\nterminal velocity 1 =', this.terminal_Velocity1(),
          '\nterminal velocity 2 =', this.terminal_Velocity2(),
          '\npos =', this.position,
          '\ntime =', time,
          '\ncollision_intensity =', this.collision_intensity(),
          '\nlanding_Safety =', this.landing_Safety)
      }
    }
  }
}