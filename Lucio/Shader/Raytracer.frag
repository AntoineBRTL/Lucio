#version 300 es

//////////////////////
// LUXIO PTX SHADER //
//////////////////////

precision mediump float;
out vec4 fragColor;

#define RAY_BOUNCES 8
#define SAMPLES_PER_PIXELS 10

/** Window resolution */
uniform float width;
uniform float height;
uniform float focalLength;
uniform float far;
uniform float near;
uniform float randomSeed;

float random = 1.0;

/** Ray struct */
struct Ray
{
    vec3 origin;
    vec3 direction;
};

/** Sphere representation */
struct Sphere
{
    vec3 position;
    float radius;
};

/** Information about hit */
struct HitInfo
{
    float t;
    vec3 point;
    vec3 normal;
};  

/** Generates a random number from -1 to 1 */
float generateRandom() 
{
    random = (fract(sin(dot(gl_FragCoord.xy * randomSeed * random, vec2(12.9898,78.233)))*43758.5453123)*2.0) - 1.0;
    return random;
}

/** Creates a primary ray facing the current pixel from `origin` */
Ray getPrimaryRay(vec3 origin)
{
    float denom = min(width, height);
    vec3 direction = vec3(
        (gl_FragCoord.x + generateRandom() - width/2.0)/denom,
        (gl_FragCoord.y + generateRandom() - height/2.0)/denom,
        focalLength
    );
    return Ray(origin, normalize(direction));
}

/** Records a ray hit test for a sphere */
float sphereHit(Ray ray, Sphere sphere)
{
    vec3 distanceFromCenter = ray.origin - sphere.position;

    float b = 2.0*dot(ray.direction, distanceFromCenter);
    float c = dot(distanceFromCenter, distanceFromCenter) - pow(sphere.radius, 2.0);

    float delta = pow(b, 2.0) - 4.0*c;

    /** No solution(s) in R, sphere ins't hit */
    if(delta <= 0.0) return -1.0;

    float t = (-b - sqrt(delta))/2.0;

    /** Intersection behind camera */
    if(t <= 0.0) return -1.0;

    return t;
}

/** Get an intersection point */
vec3 rayAt(Ray ray, float t)
{
    return ray.origin + ray.direction*t;
}

/** TMP spheres */
#define SPHERE_COUNT 2
Sphere[SPHERE_COUNT] spheres;

HitInfo getDefaultHitInfo()
{
    return HitInfo(far, vec3(0.0), vec3(0.0));
}

vec3 generateRandomVec3()
{
    return vec3(generateRandom(), generateRandom(), generateRandom());
}

Ray getScatteredRay(vec3 point, vec3 normal)
{
    return Ray(point, normalize(normal + generateRandomVec3()));
}

vec3 getSphereNormal(Sphere sphere, vec3 point)
{
    return normalize(point - sphere.position);
}

vec3 getRayColor(vec3 origin)
{
    vec3 color = vec3(1.0);
    Ray ray = getPrimaryRay(origin);
    HitInfo hitInfo = getDefaultHitInfo();

    for(int i = 0; i < RAY_BOUNCES; i++)
    {
        /** Test intersection for each spheres */
        for(int j = 0; j < SPHERE_COUNT; j++)
        {
            float t = sphereHit(ray, spheres[j]);

            /** Does'nt hit */
            if(t < near) continue;

            /** May hit further */
            if(t < hitInfo.t)
            {
                /** Compute intersection point and normal */
                vec3 point = rayAt(ray, t);
                vec3 normal = getSphereNormal(spheres[j], point);

                /** Update hitInfo */
                hitInfo = HitInfo(t, point, normal);
            }
        }

        /** Check if a ray has hit */
        if(hitInfo.t >= far)
        {
            return color *= vec3(0.5, 0.7, 1.0);
        }

        /** TMP shade */
        color *= 0.5;

        /** Update ray */
        ray = getScatteredRay(hitInfo.point, hitInfo.normal);

        /** Reset hitInfo */
        hitInfo = getDefaultHitInfo();
    }

    return color;
}

vec3 getPixelColor(vec3 origin)
{
    vec3 color = vec3(0.0);

    for(int i = 0; i < SAMPLES_PER_PIXELS; i++)
    {
        color += getRayColor(origin);
    }

    return color/float(SAMPLES_PER_PIXELS);
}

void main()
{

    /** Generate scene */
    spheres[0] = Sphere(vec3(0.0, 0.0, 5.0), 0.5);
    spheres[1] = Sphere(vec3(0.0, -1000.5, 5.0), 1000.0);

    fragColor = vec4(sqrt(getPixelColor(vec3(0.0))), 1.0);
}