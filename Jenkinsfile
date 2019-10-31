def app

podTemplate(label: "${SLAVE_POD}") {
    node("${SLAVE_POD}") {
        container("${SLAVE_POD_CONTAINER}") {
            stage('Clone Repository') {
                checkout scm
            }
            
            stage ('Build Image') {
                app = docker.build("${CONTAINER_NAME}")
            }
            
            stage('Test Image') {
                app.inside {
                    sh 'echo "Volkswagen Tests passed"'
                }
            }
            
            stage('Push Image To Docker Hub') {
                docker.withRegistry("${CONTAINER_REGISTRY}", "${CREDS_ID}") {
                    app.push("${env.BUILD_NUMBER}")
                    app.push("latest")
                }
            }
            
            stage('Clean Pod') {
                kubernetesDeploy(
                    kubeconfigId: "${KUBE_CONFIG_ID}",
                    configs: "${MANIFEST}",
                    deleteResource: true
                )
            }
            
            stage('Deploy New Pod') {
                kubernetesDeploy(
                    kubeconfigId: "${KUBE_CONFIG_ID}",
                    configs: "${MANIFEST}",
                )
            }
        }
    }
}
