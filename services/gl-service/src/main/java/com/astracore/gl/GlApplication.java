package com.astracore.gl;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class GlApplication {

    public static void main(String[] args) {
        SpringApplication.run(GlApplication.class, args);
    }
}
