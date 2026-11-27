# Gerar Imagens - Série Tecnologia e Avanços

Comando automático para gerar imagens para a série de 3 partes sobre tecnologia e avanços tecnológicos.

## 📋 O que este comando faz

1. Identifica todos os drafts pendentes de imagem (status "Pendente GPT")
2. Extrai os prompts de imagem dos metadados
3. Tenta gerar cada imagem usando o modelo GPT Image 2
4. Atualiza os arquivos de rascunho com o caminho da imagem gerada
5. Cria um relatório de status

## 🚀 Como executar

Este comando pode ser executado automaticamente quando houver disponibilidade de credenciais para geração de imagens.

---

## Processamento Automático

Para esta série específica, os prompts já estão definidos nos metadados dos rascunhos:

### Parte 1 - IA Generativa
**Prompt**: "Futuristic tech illustration showing the evolution from traditional workflow to AI agent orchestration. Left side: human workers manually coding, designing, analyzing - grayscale, traditional office setting. Right side: human strategist overseeing network of AI agents (LLM, code generator, designer, researcher) connected by glowing neural pathways. Central concept: "cognitive infrastructure" as the new internet-like utility. Clean corporate style, modern tech aesthetic, blue/purple gradient with orange accents for human elements. Professional B2B illustration style."

### Parte 2 - Hardware Heterogêneo
**Prompt**: "Technical convergence infographic showing 4 hardware layers converging into one system. Bottom layer: silicon chips with transistors (brown/gold). Middle layer: quantum processor with qubit arrays (blue/purple). Next layer: neuromorphic chip with spiking neural networks (green/orange). Top layer: photonic chip with light beams (white/cyan). All layers connect with golden arrows converging toward center where a human silhouette makes a decision. Clean technical diagram style, engineering aesthetic, sans-serif labels. Modern infographics design."

### Parte 3 - Convergência
**Prompt**: "Flywheel diagram showing technological convergence: 5 interconnected circles representing AI Generative, Heterogeneous Hardware, Biology, Energy Fusion, Space. Each circle has an icon and connects with arrows to center point where human silhouette makes decision. Colorful but professional, infographic style with clean lines, modern tech aesthetic."

## ✍️ Instruções

Este comando processa uma série editorial específica. Para geração automática de imagens para outras séries, use a skill `publication-image-generation` normalmente.