CREATE TABLE IF NOT EXISTS projects (
                                        id INT AUTO_INCREMENT PRIMARY KEY,
                                        title VARCHAR(255) NOT NULL,
                                        description TEXT,
                                        date DATE NOT NULL,
                                        columnNum TINYINT NOT NULL
);

CREATE TABLE IF NOT EXISTS images (
                                      id INT AUTO_INCREMENT PRIMARY KEY,
                                      project_id INT NOT NULL,
                                      image_filename VARCHAR(255) NOT NULL,
                                      height INT NOT NULL,
                                      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);