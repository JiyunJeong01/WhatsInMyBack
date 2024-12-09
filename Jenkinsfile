pipeline {
    agent any
    environment {
        PROJECT_ID = 'sungshinserverpj'
        CLUSTER_NAME = 'k8s'
        LOCATION = 'asia-northeast3-a'
        CREDENTIALS_ID = '6ce98bad-d77d-41db-bad5-4cc756dcd06d'
    }
    stages {
        stage("Checkout code") {
            steps {
                checkout scm
            }
        }
        stage("Prepare env") {
            steps {
                script {
                    sh "cp /var/jenkins_home/.env ./.env"
                }
            }
        }
        stage("Build image") {
            steps {
                script {
                    myapp = docker.build("jiyunjeong/wimb-devops:${env.BUILD_ID}")
                }
            }
        }
        stage("Push image") {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'jiyunJeong') {
                        myapp.push("latest")
                        myapp.push("${env.BUILD_ID}")
                    }
                }
            }
        }
        stage('Deploy to GKE') {
            when {
                branch 'main'
            }
            steps {
                 sh "sed -i 's|jiyunjeong/wimb-devops:latest|jiyunjeong/wimb-devops:${env.BUILD_ID}|g' Deployment.yaml"
                step([$class: 'KubernetesEngineBuilder', 
                          projectId: env.PROJECT_ID, 
                          clusterName: env.CLUSTER_NAME, 
                          location: env.LOCATION, 
                          manifestPattern: 'Deployment.yaml', 
                          credentialsId: env.CREDENTIALS_ID, 
                          verifyDeployments: true])
                
            }
        }
    }
}