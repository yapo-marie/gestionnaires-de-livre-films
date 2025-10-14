#!/usr/bin/env bash
set -euo pipefail

CLUSTER_NAME="collection-cluster"
K8S_DIR="$(dirname "$0")/k8s"

if ! command -v kind >/dev/null 2>&1; then
  echo "Kind n'est pas installé. Voir https://kind.sigs.k8s.io docs."
  exit 1
fi

if ! command -v kubectl >/dev/null 2>&1; then
  echo "kubectl n'est pas installé."
  exit 1
fi

echo "➡️  Création du cluster Kind '${CLUSTER_NAME}' si nécessaire..."
if ! kind get clusters | grep -q "${CLUSTER_NAME}"; then
  kind create cluster --name "${CLUSTER_NAME}" --config "${K8S_DIR}/kind-config.yaml"
else
  echo "Cluster déjà présent, saut de la création."
fi

echo "➡️  Construction des images Docker locales..."
docker build -t collection-backend:latest "$(dirname "$0")/backend"
docker build -t collection-frontend:latest "$(dirname "$0")/frontend"

echo "➡️  Chargement des images dans le cluster Kind..."
kind load docker-image collection-backend:latest --name "${CLUSTER_NAME}"
kind load docker-image collection-frontend:latest --name "${CLUSTER_NAME}"

echo "➡️  Déploiement des manifests Kubernetes..."
kubectl apply -f "${K8S_DIR}/namespace.yaml"
kubectl apply -f "${K8S_DIR}"

echo "✅  Déploiement terminé. Vérifiez les pods avec: kubectl get pods -n collection-app"
