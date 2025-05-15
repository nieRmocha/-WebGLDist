#version 300 es
precision highp float;
precision highp int;

in vec3 fragPos;
in vec3 normal;
in vec3 lightingColor;

out vec4 FragColor;

uniform int u_renderingMode;  // 0: PHONG, 1: GOURAUD

struct Material {
    vec3 diffuse;
    vec3 specular;
    float shininess;
};

struct Light {
    vec3 position;
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};

uniform Material material;
uniform Light light;
uniform vec3 u_viewPos;

void main() {
    if (u_renderingMode == 1) {
        FragColor = vec4(lightingColor, 1.0);
    } else {
        vec3 rgb = material.diffuse;

        // ambient
        vec3 ambient = light.ambient * rgb;

        // diffuse
        vec3 norm = normalize(normal);
        vec3 lightDir = normalize(light.position - fragPos);
        float dotNormLight = dot(norm, lightDir);
        float diff = max(dotNormLight, 0.0);
        vec3 diffuse = light.diffuse * diff * rgb;

        // specular
        vec3 viewDir = normalize(u_viewPos - fragPos);
        vec3 reflectDir = reflect(-lightDir, norm);
        float spec = 0.0;
        if (dotNormLight > 0.0) {
            spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
        }
        vec3 specular = light.specular * (spec * material.specular);

        vec3 result = ambient + diffuse + specular;
        FragColor = vec4(result, 1.0);
    }
}
