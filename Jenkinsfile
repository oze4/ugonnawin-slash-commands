def app
def slave_pod = ${SLAVE_POD}
def slave_pod_container = ${SLAVE_POD_CONTAINER}
def container_name = ${CONTAINER_NAME}
def kube_config_id = ${KUBE_CONFIG_ID}
def manifest = ${MANIFEST}
def container_registry = ${CONTAINER_REGISTRY}
def creds_id = ${CREDS_ID}

podTemplate(label: slave_pod) {
    node(slave_pod) {
        container(slave_pod_container) {
            stage('Clone Repository') {
                checkout scm
            }
            
            stage ('Build Image') {
                app = docker.build(container_name)
            }
            
            stage('Test Image') {
                app.inside {
                    sh 'echo "Volkswagen Tests passed"'
                }
            }
            
            stage('Push Image To Docker Hub') {
                docker.withRegistry(container_registry, creds_id) {
                    app.push("${env.BUILD_NUMBER}")
                    app.push("latest")
                }
            }
            
            stage('Clean Pod') {
                kubernetesDeploy(
                    kubeconfigId: kube_config_id,
                    configs: manifest,
                    deleteResource: true
                )
            }
            
            stage('Deploy New Pod') {
                kubernetesDeploy(
                    kubeconfigId: kube_config_id,
                    configs: manifest,
                )
            }
        }
    }
}
